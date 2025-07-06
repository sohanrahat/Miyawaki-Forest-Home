
import React, { useState } from 'react';
import { GiTreeGrowth, GiPlantSeed } from 'react-icons/gi';
import { FaTrash, FaCheck } from 'react-icons/fa';

const SpeciesSelection = ({ speciesSuggestions, selectedSpecies, setSelectedSpecies, onConfirm, transformSpeciesData }) => {
    const [tempSelectedSpecies, setTempSelectedSpecies] = useState(selectedSpecies);

    const handleSpeciesToggle = (layer, species) => {
        setTempSelectedSpecies(prev => {
            const layerSpecies = prev[layer] || [];
            const isSelected = layerSpecies.some(s => s.name === species.name);
            
            if (isSelected) {
                return {
                    ...prev,
                    [layer]: layerSpecies.filter(s => s.name !== species.name)
                };
            } else {
                return {
                    ...prev,
                    [layer]: [...layerSpecies, species]
                };
            }
        });
    };

    const handleConfirmSelection = () => {
        // Generate random counts for selected species based on Miyawaki principles
        const plantsWithCounts = {};
        
        Object.entries(tempSelectedSpecies).forEach(([layer, species]) => {
            plantsWithCounts[layer] = species.map(spec => {
                let randomCount;
                // Assign random counts based on layer and Miyawaki density principles
                switch(layer) {
                    case 'canopy':
                        randomCount = Math.floor(Math.random() * 20) + 10; // 10-30 trees
                        break;
                    case 'subcanopy':
                        randomCount = Math.floor(Math.random() * 25) + 15; // 15-40 trees
                        break;
                    case 'shrub':
                        randomCount = Math.floor(Math.random() * 30) + 20; // 20-50 shrubs
                        break;
                    case 'ground':
                        randomCount = Math.floor(Math.random() * 20) + 5; // 5-25 ground plants
                        break;
                    default:
                        randomCount = Math.floor(Math.random() * 15) + 10;
                }
                
                // Transform the JSON species data to match component expectations
                const transformedSpec = transformSpeciesData ? transformSpeciesData(spec) : spec;
                
                return {
                    ...transformedSpec,
                    count: randomCount
                };
            });
        });
        
        setSelectedSpecies(tempSelectedSpecies);
        onConfirm(plantsWithCounts);
    };

    const layerColors = {
        canopy: 'bg-green-100 border-green-300',
        subcanopy: 'bg-yellow-100 border-yellow-300',
        shrub: 'bg-blue-100 border-blue-300',
        ground: 'bg-purple-100 border-purple-300'
    };

    const layerIcons = {
        canopy: '🌳',
        subcanopy: '🌿',
        shrub: '🌱',
        ground: '🍃'
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                    Select Species for Your Forest
                </h2>
                <button
                    onClick={handleConfirmSelection}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium"
                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                >
                    <FaCheck className="mr-2" />
                    Confirm Selection
                </button>
            </div>

            <p className="text-green-700 mb-8 text-center" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                🌱 Select species from each layer to create your diverse forest ecosystem. Quantities will be assigned automatically based on Miyawaki principles.
            </p>

            <div className="grid grid-cols-4 gap-6">
                {Object.entries(speciesSuggestions).map(([layer, species]) => (
                    <div key={layer} className={`p-4 rounded-xl border-2 shadow-lg ${layerColors[layer]}`}>
                        <h3 className="text-lg font-semibold capitalize flex flex-col items-center mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                            <span className="text-2xl mb-1">{layerIcons[layer]}</span>
                            {layer} Layer
                            <span className="text-xs font-normal text-green-700 mt-1">
                                {layer === 'canopy' && '(15-30m height)'}
                                {layer === 'subcanopy' && '(4-15m height)'}
                                {layer === 'shrub' && '(0.5-4m height)'}
                                {layer === 'ground' && '(0-0.5m height)'}
                            </span>
                            <span className="text-xs font-normal text-green-600">
                                ({tempSelectedSpecies[layer]?.length || 0} selected)
                            </span>
                        </h3>
                        
                        <div className="space-y-2">
                            {species.map((spec, index) => {
                                const isSelected = tempSelectedSpecies[layer]?.some(s => s.name === spec.name);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSpeciesToggle(layer, spec)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                            isSelected 
                                                ? 'bg-green-200 border-green-500 shadow-sm' 
                                                : 'bg-white border-gray-200 hover:border-green-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-green-900 text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                                {spec.name}
                                            </span>
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                            }`}>
                                                {isSelected && <FaCheck className="text-white text-xs" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Species = ({ plants, totalByLayer, addNewSpecies, setPlants, deleteSpecies, speciesSuggestions, selectedSpecies, setSelectedSpecies, speciesSelectionConfirmed, setSpeciesSelectionConfirmed, transformSpeciesData }) => {
    
    const handleConfirmSpeciesSelection = (plantsWithCounts) => {
        setPlants(plantsWithCounts);
        setSpeciesSelectionConfirmed(true);
    };

    // Show species selection if not confirmed yet
    if (!speciesSelectionConfirmed) {
        return (
            <SpeciesSelection
                speciesSuggestions={speciesSuggestions}
                selectedSpecies={selectedSpecies}
                setSelectedSpecies={setSelectedSpecies}
                onConfirm={handleConfirmSpeciesSelection}
                transformSpeciesData={transformSpeciesData}
            />
        );
    }

    // Show species management dashboard after confirmation

    const updatePlantProperty = (layer, index, property, value) => {
        const newPlants = { ...plants };
        newPlants[layer][index][property] = value;
        setPlants(newPlants);
    };

    return (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Species Management</h2>

        {Object.entries(plants).map(([layer, plantList]) => (
            <div key={layer} className="mb-8 bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold capitalize flex items-center text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        <GiTreeGrowth className="mr-3 text-green-600" size={24} />
                        {layer} Layer ({totalByLayer[layer]} plants)
                    </h3>
                    <button
                        onClick={() => addNewSpecies(layer)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md font-medium"
                        style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                    >
                        <GiPlantSeed size={18} className="mr-2" /> Add Species
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-green-100 border-b-2 border-green-300">
                            <tr>
                                <th className="text-left p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Species</th>
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Count</th>
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Height (m)</th>
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Years to Fruit</th>
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Harvest</th>
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantList.map((plant, index) => (
                                <tr key={index} className="border-b border-green-200 hover:bg-green-50 transition-colors">
                                    <td className="p-4">
                                        <input
                                            type="text"
                                            value={plant.name}
                                            onChange={(e) => updatePlantProperty(layer, index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            value={plant.count}
                                            onChange={(e) => updatePlantProperty(layer, index, 'count', parseInt(e.target.value) || 0)}
                                            className="w-20 px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium text-center"
                                            min="0"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            value={plant.mature_height}
                                            onChange={(e) => updatePlantProperty(layer, index, 'mature_height', parseFloat(e.target.value) || 0)}
                                            className="w-20 px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium text-center"
                                            min="0"
                                            step="0.1"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <input
                                            type="number"
                                            value={plant.years_to_fruit}
                                            onChange={(e) => updatePlantProperty(layer, index, 'years_to_fruit', parseInt(e.target.value) || 0)}
                                            className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium text-center"
                                            min="0"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={plant.harvest_month}
                                            onChange={(e) => updatePlantProperty(layer, index, 'harvest_month', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                        >
                                            <option value="">N/A</option>
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => deleteSpecies(layer, index)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ))}
    </div>
    );
};

export default Species;
