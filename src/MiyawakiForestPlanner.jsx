
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Overview from './components/Overview';
import Species from './components/Species';
import Timeline from './components/Timeline';
import Costs from './components/Costs';
import Blueprint from './components/Blueprint';
import Export from './components/Export';

const MiyawakiForestPlanner = () => {
    // Species suggestions database for user selection
    const speciesSuggestions = {
        canopy: [
            { name: 'Mango (Am)', years_to_fruit: 5, harvest_month: 'June-Aug', mature_height: 20 },
            { name: 'Jackfruit (Kathal)', years_to_fruit: 7, harvest_month: 'June-Sept', mature_height: 18 },
            { name: 'Coconut (Narikel)', years_to_fruit: 6, harvest_month: 'Year-round', mature_height: 15 },
            { name: 'Jamun', years_to_fruit: 8, harvest_month: 'May-July', mature_height: 20 },
            { name: 'Tamarind (Tetul)', years_to_fruit: 10, harvest_month: 'Feb-Mar', mature_height: 18 },
            { name: 'Mahogany', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 25 },
            { name: 'Neem', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 20 },
            { name: 'Rain Tree', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 25 },
            { name: 'Hijol', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 15 },
            { name: 'Bamboo', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 20 },
            { name: 'Teak', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 30 },
            { name: 'Sal', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 25 }
        ],
        subcanopy: [
            { name: 'Guava (Peyara)', years_to_fruit: 3, harvest_month: 'July-Sept', mature_height: 8 },
            { name: 'Litchi', years_to_fruit: 5, harvest_month: 'June-July', mature_height: 10 },
            { name: 'Cashew (Kaju)', years_to_fruit: 4, harvest_month: 'Mar-May', mature_height: 9 },
            { name: 'Custard Apple', years_to_fruit: 4, harvest_month: 'Aug-Oct', mature_height: 6 },
            { name: 'Star Fruit', years_to_fruit: 3, harvest_month: 'Nov-Jan', mature_height: 7 },
            { name: 'Sapota', years_to_fruit: 5, harvest_month: 'May-Sept', mature_height: 8 },
            { name: 'Moringa (Sajina)', years_to_fruit: 1, harvest_month: 'Year-round', mature_height: 6 },
            { name: 'Papaya', years_to_fruit: 1, harvest_month: 'Year-round', mature_height: 5 },
            { name: 'Banana', years_to_fruit: 1, harvest_month: 'Year-round', mature_height: 4 },
            { name: 'Drumstick', years_to_fruit: 2, harvest_month: 'Feb-Apr', mature_height: 8 },
            { name: 'Curry Leaf', years_to_fruit: 2, harvest_month: 'Year-round', mature_height: 4 },
            { name: 'Pomegranate', years_to_fruit: 3, harvest_month: 'Oct-Feb', mature_height: 6 }
        ],
        shrub: [
            { name: 'Indian Jujube (Boroi)', years_to_fruit: 2, harvest_month: 'Feb-Mar', mature_height: 3 },
            { name: 'Indian Gooseberry', years_to_fruit: 3, harvest_month: 'Oct-Jan', mature_height: 3 },
            { name: 'Mulberry', years_to_fruit: 2, harvest_month: 'Mar-May', mature_height: 3 },
            { name: 'Rose Apple', years_to_fruit: 3, harvest_month: 'May-June', mature_height: 3 },
            { name: 'Chili varieties', years_to_fruit: 0.5, harvest_month: 'Year-round', mature_height: 1 },
            { name: 'Brinjal (Eggplant)', years_to_fruit: 0.5, harvest_month: 'Year-round', mature_height: 1 },
            { name: 'Okra (Bhindi)', years_to_fruit: 0.3, harvest_month: 'Summer', mature_height: 1.5 },
            { name: 'Tomato', years_to_fruit: 0.3, harvest_month: 'Winter', mature_height: 1 },
            { name: 'Lemon/Lime', years_to_fruit: 3, harvest_month: 'Year-round', mature_height: 2.5 },
            { name: 'Tulsi (Holy Basil)', years_to_fruit: 0.2, harvest_month: 'Year-round', mature_height: 0.5 },
            { name: 'Aloe Vera', years_to_fruit: 0, harvest_month: 'N/A', mature_height: 0.5 },
            { name: 'Hibiscus', years_to_fruit: 1, harvest_month: 'Year-round', mature_height: 2 }
        ],
        ground: [
            { name: 'Spinach varieties', years_to_fruit: 0.2, harvest_month: 'Winter', mature_height: 0.3 },
            { name: 'Amaranth (Lal Shak)', years_to_fruit: 0.2, harvest_month: 'Year-round', mature_height: 0.4 },
            { name: 'Bottle Gourd leaves', years_to_fruit: 0.3, harvest_month: 'Summer', mature_height: 0.3 },
            { name: 'Water Spinach', years_to_fruit: 0.2, harvest_month: 'Monsoon', mature_height: 0.3 },
            { name: 'Ginger', years_to_fruit: 0.8, harvest_month: 'Oct-Dec', mature_height: 0.5 },
            { name: 'Turmeric', years_to_fruit: 0.8, harvest_month: 'Jan-Mar', mature_height: 0.5 },
            { name: 'Coriander', years_to_fruit: 0.2, harvest_month: 'Winter', mature_height: 0.3 },
            { name: 'Mint', years_to_fruit: 0.2, harvest_month: 'Year-round', mature_height: 0.3 },
            { name: 'Sweet Potato', years_to_fruit: 0.5, harvest_month: 'Oct-Dec', mature_height: 0.3 },
            { name: 'Pumpkin', years_to_fruit: 0.3, harvest_month: 'Winter', mature_height: 0.3 },
            { name: 'Cucumber', years_to_fruit: 0.2, harvest_month: 'Summer', mature_height: 0.3 },
            { name: 'Radish', years_to_fruit: 0.2, harvest_month: 'Winter', mature_height: 0.2 }
        ]
    };

    // Species selection state
    const [selectedSpecies, setSelectedSpecies] = useState({
        canopy: [],
        subcanopy: [],
        shrub: [],
        ground: []
    });
    const [speciesSelectionConfirmed, setSpeciesSelectionConfirmed] = useState(false);

    // Initial plant database with Bangladesh species
    const [plants, setPlants] = useState({
        canopy: [
            { name: 'Mango (Am)', count: 25, mature_height: 20, years_to_fruit: 5, harvest_month: 'June-Aug' },
            { name: 'Jackfruit (Kathal)', count: 20, mature_height: 18, years_to_fruit: 7, harvest_month: 'June-Sept' },
            { name: 'Coconut (Narikel)', count: 15, mature_height: 15, years_to_fruit: 6, harvest_month: 'Year-round' },
            { name: 'Jamun', count: 15, mature_height: 20, years_to_fruit: 8, harvest_month: 'May-July' },
            { name: 'Tamarind (Tetul)', count: 10, mature_height: 18, years_to_fruit: 10, harvest_month: 'Feb-Mar' },
            { name: 'Mahogany', count: 15, mature_height: 25, years_to_fruit: 0, harvest_month: 'N/A' },
            { name: 'Neem', count: 20, mature_height: 20, years_to_fruit: 0, harvest_month: 'N/A' },
            { name: 'Rain Tree', count: 10, mature_height: 25, years_to_fruit: 0, harvest_month: 'N/A' },
            { name: 'Hijol', count: 10, mature_height: 15, years_to_fruit: 0, harvest_month: 'N/A' },
            { name: 'Bamboo', count: 10, mature_height: 20, years_to_fruit: 0, harvest_month: 'N/A' }
        ],
        subcanopy: [
            { name: 'Guava (Peyara)', count: 30, mature_height: 8, years_to_fruit: 3, harvest_month: 'July-Sept' },
            { name: 'Litchi', count: 25, mature_height: 10, years_to_fruit: 5, harvest_month: 'June-July' },
            { name: 'Cashew (Kaju)', count: 20, mature_height: 9, years_to_fruit: 4, harvest_month: 'Mar-May' },
            { name: 'Custard Apple', count: 15, mature_height: 6, years_to_fruit: 4, harvest_month: 'Aug-Oct' },
            { name: 'Star Fruit', count: 20, mature_height: 7, years_to_fruit: 3, harvest_month: 'Nov-Jan' },
            { name: 'Sapota', count: 15, mature_height: 8, years_to_fruit: 5, harvest_month: 'May-Sept' },
            { name: 'Moringa (Sajina)', count: 35, mature_height: 6, years_to_fruit: 1, harvest_month: 'Year-round' },
            { name: 'Papaya', count: 25, mature_height: 5, years_to_fruit: 1, harvest_month: 'Year-round' },
            { name: 'Banana', count: 30, mature_height: 4, years_to_fruit: 1, harvest_month: 'Year-round' },
            { name: 'Drumstick', count: 15, mature_height: 8, years_to_fruit: 2, harvest_month: 'Feb-Apr' },
            { name: 'Curry Leaf', count: 20, mature_height: 4, years_to_fruit: 2, harvest_month: 'Year-round' }
        ],
        shrub: [
            { name: 'Indian Jujube (Boroi)', count: 40, mature_height: 3, years_to_fruit: 2, harvest_month: 'Feb-Mar' },
            { name: 'Indian Gooseberry', count: 30, mature_height: 3, years_to_fruit: 3, harvest_month: 'Oct-Jan' },
            { name: 'Mulberry', count: 25, mature_height: 3, years_to_fruit: 2, harvest_month: 'Mar-May' },
            { name: 'Rose Apple', count: 20, mature_height: 3, years_to_fruit: 3, harvest_month: 'May-June' },
            { name: 'Chili varieties', count: 50, mature_height: 1, years_to_fruit: 0.5, harvest_month: 'Year-round' },
            { name: 'Brinjal (Eggplant)', count: 40, mature_height: 1, years_to_fruit: 0.5, harvest_month: 'Year-round' },
            { name: 'Okra (Bhindi)', count: 30, mature_height: 1.5, years_to_fruit: 0.3, harvest_month: 'Summer' },
            { name: 'Tomato', count: 35, mature_height: 1, years_to_fruit: 0.3, harvest_month: 'Winter' },
            { name: 'Lemon/Lime', count: 25, mature_height: 2.5, years_to_fruit: 3, harvest_month: 'Year-round' },
            { name: 'Tulsi (Holy Basil)', count: 30, mature_height: 0.5, years_to_fruit: 0.2, harvest_month: 'Year-round' },
            { name: 'Aloe Vera', count: 26, mature_height: 0.5, years_to_fruit: 0, harvest_month: 'N/A' }
        ],
        ground: [
            { name: 'Spinach varieties', count: 40, mature_height: 0.3, years_to_fruit: 0.2, harvest_month: 'Winter' },
            { name: 'Amaranth (Lal Shak)', count: 35, mature_height: 0.4, years_to_fruit: 0.2, harvest_month: 'Year-round' },
            { name: 'Bottle Gourd leaves', count: 20, mature_height: 0.3, years_to_fruit: 0.3, harvest_month: 'Summer' },
            { name: 'Water Spinach', count: 25, mature_height: 0.3, years_to_fruit: 0.2, harvest_month: 'Monsoon' },
            { name: 'Ginger', count: 30, mature_height: 0.5, years_to_fruit: 0.8, harvest_month: 'Oct-Dec' },
            { name: 'Turmeric', count: 30, mature_height: 0.5, years_to_fruit: 0.8, harvest_month: 'Jan-Mar' },
            { name: 'Coriander', count: 25, mature_height: 0.3, years_to_fruit: 0.2, harvest_month: 'Winter' },
            { name: 'Mint', count: 20, mature_height: 0.3, years_to_fruit: 0.2, harvest_month: 'Year-round' },
            { name: 'Sweet Potato', count: 15, mature_height: 0.3, years_to_fruit: 0.5, harvest_month: 'Oct-Dec' },
            { name: 'Pumpkin', count: 8, mature_height: 0.3, years_to_fruit: 0.3, harvest_month: 'Winter' },
            { name: 'Cucumber', count: 3, mature_height: 0.3, years_to_fruit: 0.2, harvest_month: 'Summer' }
        ]
    });

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
    const density = (totalPlants / projectInfo.plantingArea).toFixed(2);

    // Add new plant species
    const addNewSpecies = (layer) => {
        const newPlants = { ...plants };
        newPlants[layer].push({
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
        const soilCost = projectInfo.plantingArea * costs.soilAmendmentPerM2;
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
