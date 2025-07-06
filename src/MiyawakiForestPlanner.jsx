
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Overview from './components/Overview';
import Species from './components/Species';
import Timeline from './components/Timeline';
import Costs from './components/Costs';
import Blueprint from './components/Blueprint';
import Export from './components/Export';

// Helper function to format harvest months
const formatHarvestMonths = (months) => {
    if (!months || months.length === 0) return 'N/A';
    if (months.length > 6) return 'Year-round';
    return months.join(', ');
};

// Create base plant templates from database
const createBasePlantTemplates = (speciesData) => {
    if (!speciesData) return {};
    
    const predefinedCounts = {
        canopy: [25, 20, 15, 15, 10, 15, 20, 10, 10, 10],
        subcanopy: [30, 25, 20, 15, 20, 15, 35, 25, 30, 15, 20],
        shrub: [40, 30, 25, 20, 50, 40, 30, 35, 25, 30, 26],
        ground: [40, 35, 20, 25, 30, 30, 25, 20, 15, 8, 3]
    };
    
    const templates = {};
    
    Object.entries(speciesData).forEach(([layer, species]) => {
        templates[layer] = species.map((spec, index) => ({
            name: spec.name,
            count: predefinedCounts[layer]?.[index] || 10,
            ...spec
        }));
    });
    
    return templates;
};

const MiyawakiForestPlanner = () => {
    const [speciesData, setSpeciesData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [plants, setPlants] = useState({});
    const [basePlantTemplates, setBasePlantTemplates] = useState({});

    useEffect(() => {
        const fetchSpeciesData = async () => {
            try {
                const database = await import('./data/species-database.json');
                const currentRegion = 'bangladesh';
                const regionData = database.default.regions[currentRegion].layers;
                setSpeciesData(regionData);
                const templates = createBasePlantTemplates(regionData);
                setBasePlantTemplates(templates);
                setPlants(templates);
            } catch (err) {
                setError('Failed to load species database.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpeciesData();
    }, []);

    const [projectInfo, setProjectInfo] = useState({
        totalArea: '',
        pathwayArea: '',
        plantingArea: '',
        soilType: '',
        annualRainfall: '',
        avgTemp: ''
    });

    const [siteInfoConfirmed, setSiteInfoConfirmed] = useState(false);
    const [costs, setCosts] = useState({
        plantCostPerUnit: 60,
        soilAmendmentPerM2: 100,
        laborPerDay: 500,
        maintenanceMonthly: 800
    });
    const [activeTab, setActiveTab] = useState('overview');

    const filterCriteria = React.useMemo(() => {
        let waterNeeds = '';
        if (projectInfo.annualRainfall) {
            const rainfall = parseFloat(projectInfo.annualRainfall);
            if (rainfall < 1000) waterNeeds = 'low';
            else if (rainfall < 2000) waterNeeds = 'medium';
            else waterNeeds = 'high';
        }

        let sunExposure = '';
        if (projectInfo.avgTemp) {
            const avgTemp = parseFloat(projectInfo.avgTemp);
            if (avgTemp < 20) sunExposure = 'partial_shade';
            else if (avgTemp < 30) sunExposure = 'full_sun';
            else sunExposure = 'full_sun'; // Assuming very high temps still mean full sun
        }

        return {
            soilType: projectInfo.soilType,
            waterNeeds,
            sunExposure,
        };
    }, [projectInfo.soilType, projectInfo.annualRainfall, projectInfo.avgTemp]);
    
    const calculatePlantsForArea = useCallback((plantingArea) => {
        if (!plantingArea || plantingArea <= 0 || Object.keys(basePlantTemplates).length === 0) {
            return basePlantTemplates;
        }
        
        const targetDensity = 3.5;
        const totalPlantsNeeded = Math.round(plantingArea * targetDensity);
        const baseTotal = 1002;
        const scaleFactor = totalPlantsNeeded / baseTotal;
        
        const scaledPlants = {};
        Object.entries(basePlantTemplates).forEach(([layer, plants]) => {
            scaledPlants[layer] = plants.map(plant => ({
                ...plant,
                count: Math.max(1, Math.round(plant.count * scaleFactor))
            }));
        });
        
        return scaledPlants;
    }, [basePlantTemplates]);

    useEffect(() => {
        if (projectInfo.plantingArea && projectInfo.plantingArea > 0) {
            const scaledPlants = calculatePlantsForArea(projectInfo.plantingArea);
            setPlants(scaledPlants);
        }
    }, [projectInfo.plantingArea, calculatePlantsForArea]);

    const { totalPlants, totalByLayer } = React.useMemo(() => {
        let totalPlants = 0;
        let totalByLayer = { canopy: 0, subcanopy: 0, shrub: 0, ground: 0 };

        Object.entries(plants).forEach(([layer, plantList]) => {
            const layerTotal = plantList.reduce((sum, plant) => sum + plant.count, 0);
            totalByLayer[layer] = layerTotal;
            totalPlants += layerTotal;
        });

        return { totalPlants, totalByLayer };
    }, [plants]);

    const density = projectInfo.plantingArea > 0 ? (totalPlants / projectInfo.plantingArea).toFixed(2) : '0.00';

    const costBreakdown = React.useMemo(() => {
        const plantCost = totalPlants * costs.plantCostPerUnit;
        const soilCost = projectInfo.plantingArea > 0 ? projectInfo.plantingArea * costs.soilAmendmentPerM2 : 0;
        const laborCost = 10 * costs.laborPerDay;
        const threeYearMaintenance = 36 * costs.maintenanceMonthly;
        return {
            plants: plantCost,
            soil: soilCost,
            labor: laborCost,
            maintenance: threeYearMaintenance,
            total: plantCost + soilCost + laborCost + threeYearMaintenance
        };
    }, [totalPlants, costs, projectInfo.plantingArea]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading species data...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-forest-50 to-earth-50 text-forest-400 p-4">
            <div className="max-w-7xl mx-auto">
                <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
                <Header
                    totalPlants={totalPlants}
                    density={density}
                    costBreakdown={costBreakdown}
                    projectInfo={projectInfo}
                    plants={plants}
                    siteInfoConfirmed={siteInfoConfirmed}
                />

                <div className="bg-gradient-to-br from-white to-stone-50 rounded-xl shadow-medium p-6 border border-stone-200 backdrop-blur-sm">
                    {activeTab === 'overview' && (
                        <Overview
                            pieData={Object.entries(totalByLayer).map(([layer, count]) => ({
                                name: layer.charAt(0).toUpperCase() + layer.slice(1),
                                value: count,
                                color: { canopy: '#748873', subcanopy: '#D1A980', shrub: '#E5E0D8', ground: '#F8F8F8' }[layer]
                            }))}
                            projectInfo={projectInfo}
                            setProjectInfo={setProjectInfo}
                            siteInfoConfirmed={siteInfoConfirmed}
                            setSiteInfoConfirmed={setSiteInfoConfirmed}
                            setActiveTab={setActiveTab}
                        />
                    )}
                    {activeTab === 'species' && (
                        <Species
                            plants={plants}
                            setPlants={setPlants}
                            speciesSuggestions={speciesData}
                            projectInfo={projectInfo}
                            filterCriteria={filterCriteria}
                        />
                    )}
                    {activeTab === 'timeline' && (
                        <Timeline plants={plants} />
                    )}
                    {activeTab === 'costs' && (
                        <Costs
                            costs={costs}
                            setCosts={setCosts}
                            costBreakdown={costBreakdown}
                            totalPlants={totalPlants}
                            projectInfo={projectInfo}
                        />
                    )}
                    {activeTab === 'blueprint' && <Blueprint totalPlants={totalPlants} />}
                </div>
            </div>
        </div>
    );
};

export default MiyawakiForestPlanner;
