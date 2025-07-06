
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
    // Helper function to format harvest months
    const formatHarvestMonths = (months) => {
        if (!months || months.length === 0) return 'N/A';
        if (months.length > 6) return 'Year-round';
        return months.join(', ');
    };

    // Handle species selection from dropdown
    const handleSpeciesSelection = (layer, index, selectedSpeciesName) => {
        if (!selectedSpeciesName || selectedSpeciesName === '') return;
        
        // Find the selected species in the database
        const layerSpecies = speciesSuggestions[layer] || [];
        const selectedSpec = layerSpecies.find(spec => spec.name === selectedSpeciesName);
        
        if (selectedSpec) {
            // Transform the database species to match component format
            const transformedSpec = transformSpeciesData ? transformSpeciesData(selectedSpec) : selectedSpec;
            
            // Update the plant with database values
            const newPlants = { ...plants };
            newPlants[layer][index] = {
                ...newPlants[layer][index],
                name: transformedSpec.name,
                mature_height: transformedSpec.mature_height,
                years_to_fruit: transformedSpec.years_to_fruit,
                harvest_month: transformedSpec.harvest_month,
                scientific_name: transformedSpec.scientific_name,
                native: transformedSpec.native,
                economic_value: transformedSpec.economic_value,
                uses: transformedSpec.uses,
                nutritional_benefits: transformedSpec.nutritional_benefits,
                price: transformedSpec.price || 60 // Default price if not in database
            };
            setPlants(newPlants);
        }
    };
    
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
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Price (৳)</th>
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantList.map((plant, index) => (
                                <tr key={index} className="border-b border-green-200 hover:bg-green-50 transition-colors">
                                    <td className="p-4">
                                        {plant.name === 'New Species' ? (
                                            <select
                                                value=""
                                                onChange={(e) => handleSpeciesSelection(layer, index, e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                                style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                            >
                                                <option value="">Select a species...</option>
                                                {(speciesSuggestions[layer] || []).map((spec, specIndex) => (
                                                    <option key={specIndex} value={spec.name}>
                                                        {spec.name} ({spec.scientific_name})
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="flex flex-col">
                                                <span className="font-medium text-green-900" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                                    {plant.name}
                                                </span>
                                                {plant.scientific_name && (
                                                    <span className="text-sm text-green-600 italic" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                                        {plant.scientific_name}
                                                    </span>
                                                )}
                                            </div>
                                        )}
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
                                        <input
                                            type="text"
                                            value={plant.harvest_month || 'N/A'}
                                            onChange={(e) => updatePlantProperty(layer, index, 'harvest_month', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                            placeholder="e.g., June, July, August or Year-round"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <span className="text-green-700 font-medium mr-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳</span>
                                            <input
                                                type="number"
                                                value={plant.price || 60}
                                                onChange={(e) => updatePlantProperty(layer, index, 'price', parseInt(e.target.value) || 60)}
                                                className="w-20 px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium text-center"
                                                min="0"
                                            />
                                        </div>
                                        <p className="text-xs text-green-600 mt-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                            {plant.price && plant.price > 60 ? 'Database price' : 'Default price'}
                                        </p>
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
