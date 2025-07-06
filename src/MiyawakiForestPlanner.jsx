
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Overview from './components/Overview';
import Species from './components/Species';
import Timeline from './components/Timeline';
import Costs from './components/Costs';
import Blueprint from './components/Blueprint';
import Export from './components/Export';
import speciesDatabase from './data/species-database.json';

// Create base plant templates from database with predefined counts for balanced ecosystem
const createBasePlantTemplates = () => {
    const currentRegion = 'bangladesh';
    const speciesData = speciesDatabase.regions[currentRegion].layers;
    
    // Helper function to format harvest months
    const formatHarvestMonths = (months) => {
        if (!months || months.length === 0) return 'N/A';
        if (months.length > 6) return 'Year-round';
        return months.join(', ');
    };
    
    // Predefined counts for balanced ecosystem (these will be scaled based on area)
    const predefinedCounts = {
        canopy: [25, 20, 15, 15, 10, 15, 20, 10, 10, 10], // Total: 150
        subcanopy: [30, 25, 20, 15, 20, 15, 35, 25, 30, 15, 20], // Total: 250
        shrub: [40, 30, 25, 20, 50, 40, 30, 35, 25, 30, 26], // Total: 351
        ground: [40, 35, 20, 25, 30, 30, 25, 20, 15, 8, 3] // Total: 251
    };
    
    const templates = {};
    
    Object.entries(speciesData).forEach(([layer, species]) => {
        templates[layer] = species.map((spec, index) => ({
            name: spec.name,
            count: predefinedCounts[layer]?.[index] || 10, // Default count if not specified
            mature_height: spec.mature_height,
            years_to_fruit: spec.years_to_fruit,
            harvest_month: formatHarvestMonths(spec.harvest_months),
            scientific_name: spec.scientific_name,
            native: spec.native,
            economic_value: spec.economic_value,
            uses: spec.uses,
            nutritional_benefits: spec.nutritional_benefits
        }));
    });
    
    return templates;
};

// Base plant templates with Bangladesh species (proportions maintained) - moved outside component
const basePlantTemplates = createBasePlantTemplates();

const MiyawakiForestPlanner = () => {
    // Load species data from JSON database (defaulting to Bangladesh region)
    const currentRegion = 'bangladesh';
    const speciesSuggestions = speciesDatabase.regions[currentRegion].layers;
    
    // Transform JSON data to match component expectations
    const transformSpeciesData = (species) => ({
        name: species.name,
        years_to_fruit: species.years_to_fruit,
        harvest_month: species.harvest_months.length > 0 ? species.harvest_months.join(', ') : 'N/A',
        mature_height: species.mature_height,
        scientific_name: species.scientific_name,
        native: species.native,
        economic_value: species.economic_value,
        uses: species.uses,
        nutritional_benefits: species.nutritional_benefits
    });

    // Species selection state
    const [selectedSpecies, setSelectedSpecies] = useState({
        canopy: [],
        subcanopy: [],
        shrub: [],
        ground: []
    });
    const [speciesSelectionConfirmed, setSpeciesSelectionConfirmed] = useState(false);

    // Function to scale plants based on planting area
    const calculatePlantsForArea = React.useCallback((plantingArea) => {
        if (!plantingArea || plantingArea <= 0) {
            // Return base counts if no area specified
            return basePlantTemplates;
        }
        
        // Miyawaki density: 3-4 plants per m² (using 3.5 as optimal)
        const targetDensity = 3.5;
        const totalPlantsNeeded = Math.round(plantingArea * targetDensity);
        
        // Base total for proportional scaling
        const baseTotal = 1002;
        
        // Scale each layer proportionally
        const scaleFactor = totalPlantsNeeded / baseTotal;
        
        const scaledPlants = {};
        Object.entries(basePlantTemplates).forEach(([layer, plants]) => {
            scaledPlants[layer] = plants.map(plant => ({
                ...plant,
                count: Math.max(1, Math.round(plant.count * scaleFactor))
            }));
        });
        
        return scaledPlants;
    }, []);

    // Initial plant database - will be updated based on planting area
    const [plants, setPlants] = useState(basePlantTemplates);

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

    // Update plants when planting area changes
    React.useEffect(() => {
        if (projectInfo.plantingArea && projectInfo.plantingArea > 0) {
            const scaledPlants = calculatePlantsForArea(projectInfo.plantingArea);
            setPlants(scaledPlants);
        }
    }, [projectInfo.plantingArea, calculatePlantsForArea]);

    // Calculate totals
    const calculateTotals = () => {
        let totalPlants = 0;
        let totalByLayer = { canopy: 0, subcanopy: 0, shrub: 0, ground: 0 };

        Object.entries(plants).forEach(([layer, plantList]) => {
            const layerTotal = plantList.reduce((sum, plant) => sum + plant.count, 0);
            totalByLayer[layer] = layerTotal;
            totalPlants += layerTotal;
        });

        return { totalPlants, totalByLayer };
    };

    const { totalPlants, totalByLayer } = calculateTotals();
    const density = projectInfo.plantingArea && projectInfo.plantingArea > 0 
        ? (totalPlants / projectInfo.plantingArea).toFixed(2) 
        : '0.00';

    // Add new plant species
    const addNewSpecies = (layer) => {
        const newPlants = { ...plants };
        newPlants[layer].unshift({
            name: 'New Species',
            count: 10,
            mature_height: 5,
            years_to_fruit: 3,
            harvest_month: 'Unknown'
        });
        setPlants(newPlants);
    };

    // Delete plant species
    const deleteSpecies = (layer, index) => {
        const newPlants = { ...plants };
        newPlants[layer].splice(index, 1);
        setPlants(newPlants);
    };

    // Cost calculations
    const totalCost = () => {
        const plantCost = totalPlants * costs.plantCostPerUnit;
        const soilCost = (projectInfo.plantingArea && projectInfo.plantingArea > 0) 
            ? projectInfo.plantingArea * costs.soilAmendmentPerM2 
            : 0;
        const laborCost = 10 * costs.laborPerDay; // 10 days initial labor
        const threeYearMaintenance = 36 * costs.maintenanceMonthly;
        return {
            plants: plantCost,
            soil: soilCost,
            labor: laborCost,
            maintenance: threeYearMaintenance,
            total: plantCost + soilCost + laborCost + threeYearMaintenance
        };
    };

    const costBreakdown = totalCost();

    // Harvest timeline data
    const harvestTimeline = () => {
        const timeline = [];
        for (let year = 0; year <= 10; year++) {
            let fruiting = 0;
            Object.entries(plants).forEach(([, plantList]) => {
                plantList.forEach(plant => {
                    if (plant.years_to_fruit > 0 && plant.years_to_fruit <= year) {
                        fruiting += plant.count;
                    }
                });
            });
            timeline.push({ year: `Year ${year}`, plants: fruiting });
        }
        return timeline;
    };

    // Pie chart data for species distribution
    const pieData = Object.entries(totalByLayer).map(([layer, count]) => ({
        name: layer.charAt(0).toUpperCase() + layer.slice(1),
        value: count,
        color: {
            canopy: '#748873',
            subcanopy: '#D1A980',
            shrub: '#E5E0D8',
            ground: '#F8F8F8'
        }[layer]
    }));

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
                            pieData={pieData}
                            projectInfo={projectInfo}
                            setProjectInfo={setProjectInfo}
                            siteInfoConfirmed={siteInfoConfirmed}
                            setSiteInfoConfirmed={setSiteInfoConfirmed}
                        />
                    )}
                    {activeTab === 'species' && (
                        <Species
                            plants={plants}
                            totalByLayer={totalByLayer}
                            addNewSpecies={addNewSpecies}
                            setPlants={setPlants}
                            deleteSpecies={deleteSpecies}
                            speciesSuggestions={speciesSuggestions}
                            selectedSpecies={selectedSpecies}
                            setSelectedSpecies={setSelectedSpecies}
                            speciesSelectionConfirmed={speciesSelectionConfirmed}
                            setSpeciesSelectionConfirmed={setSpeciesSelectionConfirmed}
                            transformSpeciesData={transformSpeciesData}
                        />
                    )}
                    {activeTab === 'timeline' && (
                        <Timeline harvestTimeline={harvestTimeline} plants={plants} />
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
