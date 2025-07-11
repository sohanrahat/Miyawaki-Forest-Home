
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GiWaterDrop, GiTreeGrowth } from 'react-icons/gi';
import { FaMapMarkerAlt, FaCheck, FaEdit } from 'react-icons/fa';

const Overview = ({ pieData, projectInfo, setProjectInfo, siteInfoConfirmed, setSiteInfoConfirmed, setActiveTab }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [errors, setErrors] = useState({});

    // Check if this is the first time (no site info confirmed yet)
    const isFirstTime = !siteInfoConfirmed;

    const validateForm = () => {
        const newErrors = {};
        
        if (!projectInfo.totalArea || projectInfo.totalArea === '' || projectInfo.totalArea <= 0) {
            newErrors.totalArea = 'Total area must be greater than 0';
        }
        
        if (!projectInfo.soilType) {
            newErrors.soilType = 'Soil type is required';
        }
        
        if (!projectInfo.annualRainfall || projectInfo.annualRainfall === '' || projectInfo.annualRainfall <= 0) {
            newErrors.annualRainfall = 'Annual rainfall must be greater than 0';
        }
        
        if (!projectInfo.avgTemp || projectInfo.avgTemp === '' || projectInfo.avgTemp < -10 || projectInfo.avgTemp > 50) {
            newErrors.avgTemp = 'Average temperature must be between -10°C and 50°C';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            setSiteInfoConfirmed(true);
            setShowEditForm(false);
        }
    };

    const handleCancel = () => {
        // Revert to the last confirmed projectInfo if editing is cancelled
        // This requires storing the confirmed state in MiyawakiForestPlanner
        // For now, just close the form and clear errors
        setErrors({});
        setShowEditForm(false);
    };

    const handleChange = (field, value) => {
        const updatedInfo = { ...projectInfo, [field]: value };
        
        // Auto-calculate planting area based on Miyawaki principles when total area changes
        if (field === 'totalArea' && value && value > 0) {
            const plantingPercentage = 0.82;
            const calculatedPlantingArea = Math.round(value * plantingPercentage);
            updatedInfo.plantingArea = calculatedPlantingArea;
            updatedInfo.pathwayArea = value - calculatedPlantingArea;
        }
        
        setProjectInfo(updatedInfo);
        
        // Clear errors for both fields if total area was changed
        if (field === 'totalArea') {
            setErrors(prev => ({ 
                ...prev, 
                [field]: '', 
                plantingArea: '',
                pathwayArea: ''
            }));
        } else if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Effect to show edit form if site info is not confirmed
    useEffect(() => {
        if (!siteInfoConfirmed) {
            setShowEditForm(true);
        }
    }, [siteInfoConfirmed]);

    if (showEditForm || isFirstTime) {
        return (
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        {isFirstTime ? 'Enter Site Information' : 'Edit Site Information'}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                            <FaMapMarkerAlt className="mr-2" />
                            Site Dimensions
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-green-700 font-medium mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    Total Area (m²) *
                                </label>
                                <input
                                    type="number"
                                    value={projectInfo.totalArea || ''}
                                    onChange={(e) => handleChange('totalArea', e.target.value === '' ? '' : Number(e.target.value))}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-medium ${
                                        errors.totalArea ? 'border-red-400 focus:border-red-500' : 'border-green-300 focus:border-green-500'
                                    }`}
                                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                    placeholder="e.g., 334"
                                />
                                {errors.totalArea && <p className="text-red-500 text-sm mt-1">{errors.totalArea}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-green-700 font-medium mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    Planting Area (m²) * 
                                    <span className="text-sm text-green-600 font-normal ml-2">
                                        (Auto-calculated: 82% of total area)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={projectInfo.plantingArea || ''}
                                    readOnly
                                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg bg-green-50 text-green-800 font-medium cursor-not-allowed"
                                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                    placeholder="Will be calculated automatically"
                                />
                                <p className="text-green-600 text-xs mt-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    🌱 Following Miyawaki method: optimal planting density with maintenance access
                                </p>
                                {errors.plantingArea && <p className="text-red-500 text-sm mt-1">{errors.plantingArea}</p>}
                            </div>

                            <div>
                                <label className="block text-green-700 font-medium mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    Pathway Area (m²)
                                    <span className="text-sm text-green-600 font-normal ml-2">
                                        (Auto-calculated: 18% of total area)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    value={projectInfo.pathwayArea || ''}
                                    readOnly
                                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg bg-blue-50 text-blue-800 font-medium cursor-not-allowed"
                                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                    placeholder="Will be calculated automatically"
                                />
                                <p className="text-blue-600 text-xs mt-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    🚶 Access paths for maintenance, harvesting, and forest management
                                </p>
                            </div>
                            
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                            <GiWaterDrop className="mr-2" />
                            Environment & Climate
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-green-700 font-medium mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    Soil Type *
                                </label>
                                <select
                                    value={projectInfo.soilType}
                                    onChange={(e) => handleChange('soilType', e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-medium ${
                                        errors.soilType ? 'border-red-400 focus:border-red-500' : 'border-green-300 focus:border-green-500'
                                    }`}
                                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                >
                                    <option value="">Select Soil Type</option>
                                    <option value="Alluvial">Alluvial</option>
                                    <option value="Clay">Clay</option>
                                    <option value="Sandy">Sandy</option>
                                    <option value="Loamy">Loamy</option>
                                    <option value="Silt">Silt</option>
                                    <option value="Rocky">Rocky</option>
                                </select>
                                {errors.soilType && <p className="text-red-500 text-sm mt-1">{errors.soilType}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-green-700 font-medium mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    Annual Rainfall (mm) *
                                </label>
                                <input
                                    type="number"
                                    value={projectInfo.annualRainfall || ''}
                                    onChange={(e) => handleChange('annualRainfall', e.target.value === '' ? '' : Number(e.target.value))}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-medium ${
                                        errors.annualRainfall ? 'border-red-400 focus:border-red-500' : 'border-green-300 focus:border-green-500'
                                    }`}
                                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                    placeholder="e.g., 2000"
                                />
                                {errors.annualRainfall && <p className="text-red-500 text-sm mt-1">{errors.annualRainfall}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-green-700 font-medium mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    Average Temperature (°C) *
                                </label>
                                <input
                                    type="number"
                                    value={projectInfo.avgTemp || ''}
                                    onChange={(e) => handleChange('avgTemp', e.target.value === '' ? '' : Number(e.target.value))}
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none font-medium ${
                                        errors.avgTemp ? 'border-red-400 focus:border-red-500' : 'border-green-300 focus:border-green-500'
                                    }`}
                                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                    placeholder="e.g., 25"
                                />
                                {errors.avgTemp && <p className="text-red-500 text-sm mt-1">{errors.avgTemp}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-center mt-8 space-x-4">
                    {!isFirstTime && (
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium"
                        style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                    >
                        <FaCheck className="mr-2" />
                        {isFirstTime ? 'Confirm Site Information' : 'Save Changes'}
                    </button>
                </div>
            </div>
        );
    }

    // Only show overview if site info is confirmed
    if (!siteInfoConfirmed) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                    Welcome to Miyawaki Forest Planner
                </h2>
                <p className="text-green-600 text-lg" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                    Please enter your site information to begin planning your forest.
                </p>
            </div>
        );
    }

    return (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Project Overview</h2>

        <div className="grid md:grid-cols-2 gap-6">
            {/* Species Distribution Chart */}
            <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Layer Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            innerRadius={40}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="#ffffff"
                            strokeWidth={2}
                        >
                            {pieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={['#16a34a', '#22c55e', '#4ade80', '#86efac'][index % 4]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: '#f0fdf4',
                                border: '2px solid #16a34a',
                                borderRadius: '8px',
                                fontFamily: 'Crimson Pro, Georgia, serif'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Project Information */}
            <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Site Information</h3>
                    <button
                        onClick={() => {
                            setTempProjectInfo(projectInfo);
                            setShowEditForm(true);
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                        style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                    >
                        <FaEdit className="mr-1" size={12} />
                        Edit
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-green-800 font-semibold block mb-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Total Area</span>
                            <span className="text-green-900 text-xl font-bold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{projectInfo.totalArea} m²</span>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-green-800 font-semibold block mb-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Planting Area</span>
                            <span className="text-green-900 text-xl font-bold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{projectInfo.plantingArea} m²</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <span className="text-amber-800 font-semibold block mb-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Soil Type</span>
                            <span className="text-amber-900 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{projectInfo.soilType}</span>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <span className="text-amber-800 font-semibold block mb-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Rainfall</span>
                            <span className="text-amber-900 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{projectInfo.annualRainfall} mm/year</span>
                        </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <span className="text-purple-800 font-semibold block mb-1" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Average Temperature</span>
                        <span className="text-purple-900 text-lg font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{projectInfo.avgTemp}°C</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Next Step: Species Selection */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg text-white text-center">
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                🌱 Ready to Build Your Forest?
            </h3>
            <p className="mb-6 text-green-100" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                Your site is configured! Now let's select the perfect plant species for your {projectInfo.plantingArea}m² Miyawaki forest.
            </p>
            <button
                onClick={() => setActiveTab('species')}
                className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-bold text-lg shadow-md"
                style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
            >
                🌿 Select Plant Species Now
            </button>
            <p className="mt-3 text-sm text-green-200" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                Choose from native Bangladesh species optimized for your climate
            </p>
        </div>

        {/* Climate Considerations */}
        <div className="mt-8 p-6 bg-white rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                <GiWaterDrop className="mr-2 text-green-600" size={24} />
                Monsoon Adaptations
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-semibold text-green-800 mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Raised Beds</p>
                    <p className="text-green-700 text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>30-50cm elevation for flood protection</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-semibold text-green-800 mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Drainage Channels</p>
                    <p className="text-green-700 text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Perimeter system for water management</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="font-semibold text-green-800 mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Species Selection</p>
                    <p className="text-green-700 text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>70% flood-tolerant native species</p>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Overview;
