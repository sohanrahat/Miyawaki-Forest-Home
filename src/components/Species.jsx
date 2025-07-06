
import React, { useState } from 'react';
import { GiTreeGrowth, GiPlantSeed } from 'react-icons/gi';
import { FaTrash, FaCheck, FaInfoCircle } from 'react-icons/fa';

const SpeciesDetailModal = ({ species, onClose }) => {
    if (!species) return null;

    const detailItemStyle = "flex justify-between py-2 border-b border-green-200";
    const labelStyle = "font-semibold text-green-800";
    const valueStyle = "text-green-900";

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50"></div> {/* Blur layer */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-lg w-full relative z-10" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-3xl font-bold text-green-800 mb-4" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{species.name}</h2>
                <p className="text-md italic text-green-600 mb-6" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{species.scientific_name}</p>
                
                <div className="space-y-3">
                    <div className={detailItemStyle}><span className={labelStyle}>Sun Exposure:</span> <span className={valueStyle}>{species.sun_exposure}</span></div>
                    <div className={detailItemStyle}><span className={labelStyle}>Water Needs:</span> <span className={valueStyle}>{species.water_needs}</span></div>
                    <div className={detailItemStyle}><span className={labelStyle}>Soil pH:</span> <span className={valueStyle}>{species.soil_ph}</span></div>
                    <div className={detailItemStyle}><span className={labelStyle}>Drought Tolerance:</span> <span className={valueStyle}>{species.drought_tolerance}</span></div>
                    <div className={detailItemStyle}><span className={labelStyle}>Flood Tolerance:</span> <span className={valueStyle}>{species.flood_tolerance}</span></div>
                    <div className={detailItemStyle}><span className={labelStyle}>Companion Plants:</span> <span className={valueStyle}>{species.companion_plants?.join(', ') || 'None listed'}</span></div>
                    <div className={detailItemStyle}><span className={labelStyle}>Avoid Planting With:</span> <span className={valueStyle}>{species.non_companion_plants?.join(', ') || 'None listed'}</span></div>
                </div>
            </div>
        </div>
    );
};

const SpeciesSelection = ({ speciesSuggestions, selectedSpecies, setSelectedSpecies, onConfirm }) => {
    const [tempSelectedSpecies, setTempSelectedSpecies] = useState(selectedSpecies);
    const [detailedSpecies, setDetailedSpecies] = useState(null);

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
        const plantsWithCounts = {};
        
        Object.entries(tempSelectedSpecies).forEach(([layer, species]) => {
            plantsWithCounts[layer] = species.map(spec => {
                let randomCount;
                switch(layer) {
                    case 'canopy':
                        randomCount = Math.floor(Math.random() * 20) + 10;
                        break;
                    case 'subcanopy':
                        randomCount = Math.floor(Math.random() * 25) + 15;
                        break;
                    case 'shrub':
                        randomCount = Math.floor(Math.random() * 30) + 20;
                        break;
                    case 'ground':
                        randomCount = Math.floor(Math.random() * 20) + 5;
                        break;
                    default:
                        randomCount = Math.floor(Math.random() * 15) + 10;
                }
                
                return {
                    ...spec,
                    count: randomCount,
                    years_to_fruit: spec.years_to_fruit || 0 // Ensure years_to_fruit is a number
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
            <SpeciesDetailModal species={detailedSpecies} onClose={() => setDetailedSpecies(null)} />
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
                                            <div className="flex items-center">
                                                <FaInfoCircle 
                                                    className="text-green-500 hover:text-green-700 mr-2 cursor-pointer"
                                                    onClick={(e) => { e.stopPropagation(); setDetailedSpecies(spec); }}
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                    isSelected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <FaCheck className="text-white text-xs" />}
                                                </div>
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

import { filterSpecies } from '../utils/speciesUtils';

const Species = ({ plants, setPlants, speciesSuggestions, projectInfo }) => {
    const [speciesSelectionConfirmed, setSpeciesSelectionConfirmed] = useState(false);
    const [selectedSpecies, setSelectedSpecies] = useState({ canopy: [], subcanopy: [], shrub: [], ground: [] });
    const [warnings, setWarnings] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const handleConfirmSpeciesSelection = (plantsWithCounts) => {
        setPlants(plantsWithCounts);
        setSpeciesSelectionConfirmed(true);
        
    };

    if (!speciesSelectionConfirmed) {
        return (
            <SpeciesSelection
                speciesSuggestions={speciesSuggestions}
                selectedSpecies={selectedSpecies}
                setSelectedSpecies={setSelectedSpecies}
                onConfirm={handleConfirmSpeciesSelection}
                
            />
        );
    }

    const updatePlantProperty = (layer, index, property, value) => {
        const newPlants = { ...plants };
        newPlants[layer][index][property] = value;
        setPlants(newPlants);
    };

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

    const deleteSpecies = (layer, index) => {
        const newPlants = { ...plants };
        newPlants[layer].splice(index, 1);
        setPlants(newPlants);
    };

    const handleSpeciesChange = (layer, index, selectedSpeciesName) => {
        if (!selectedSpeciesName) return;

        const selectedSpec = speciesSuggestions[layer].find(spec => spec.name === selectedSpeciesName);
        if (selectedSpec) {
            const newPlants = { ...plants };
            newPlants[layer][index] = {
                ...newPlants[layer][index],
                ...selectedSpec,
                count: newPlants[layer][index].count, // Keep existing count
            };
            setPlants(newPlants);
        }
    };

    return (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Species Management</h2>

        

        {Object.entries(plants).map(([layer, plantList]) => (
            <div key={layer} className="mb-8 bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold capitalize flex items-center text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        <GiTreeGrowth className="mr-3 text-green-600" size={24} />
                        {layer} Layer ({plantList.reduce((acc, p) => acc + p.count, 0)} plants)
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
                                                onChange={(e) => handleSpeciesChange(layer, index, e.target.value)}
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
                                            value={plant.harvest_months ? plant.harvest_months.join(', ') : 'N/A'}
                                            onChange={(e) => updatePlantProperty(layer, index, 'harvest_months', e.target.value.split(',').map(m => m.trim()))}
                                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                            placeholder="e.g., June, July, August"
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