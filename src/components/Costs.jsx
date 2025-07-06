import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Costs = ({ costs, setCosts, totalPlants, projectInfo, plants, speciesSelectionConfirmed }) => {
    // Only show costs if user has provided land area AND explicitly selected species
    const hasLandArea = projectInfo.plantingArea && projectInfo.plantingArea > 0;
    
    // The key insight: we need to check if species selection was confirmed by the user
    // If speciesSelectionConfirmed is passed as prop, use it. Otherwise, assume not confirmed.
    const hasUserConfirmedSpecies = speciesSelectionConfirmed === true;
    
    if (!hasLandArea || !hasUserConfirmedSpecies) {
        return (
            <div className="text-center py-12">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-blue-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        Cost Analysis
                    </h2>
                    <p className="text-blue-700 mb-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        Please complete the following steps to view cost analysis:
                    </p>
                    <div className="space-y-2 text-left">
                        <div className={`flex items-center gap-2 ${hasLandArea ? 'text-green-700' : 'text-gray-600'}`}>
                            <span>{hasLandArea ? '✓' : '○'}</span>
                            <span style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Enter land area in Project Info</span>
                        </div>
                        <div className={`flex items-center gap-2 ${hasUserConfirmedSpecies ? 'text-green-700' : 'text-gray-600'}`}>
                            <span>{hasUserConfirmedSpecies ? '✓' : '○'}</span>
                            <span style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Select and confirm species in Species tab</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate detailed species costs using actual plant prices
    const calculateSpeciesCosts = () => {
        const layerCosts = {};
        let totalSpeciesCost = 0;
        const priceRanges = { 
            low: { count: 0, total: 0, label: 'Budget Species (৳1-50)', color: '#4ade80' },
            medium: { count: 0, total: 0, label: 'Standard Species (৳51-100)', color: '#22c55e' },
            high: { count: 0, total: 0, label: 'Premium Species (৳100+)', color: '#16a34a' }
        };

        Object.entries(plants).forEach(([layer, plantList]) => {
            layerCosts[layer] = { plants: [], total: 0 };
            
            plantList.forEach(plant => {
                const unitCost = plant.price || 60; // Use actual plant price or default
                const totalCost = unitCost * plant.count;
                
                // Categorize by price range
                let priceCategory = 'medium';
                if (unitCost <= 50) priceCategory = 'low';
                else if (unitCost >= 100) priceCategory = 'high';
                
                priceRanges[priceCategory].count += plant.count;
                priceRanges[priceCategory].total += totalCost;
                
                layerCosts[layer].plants.push({
                    name: plant.name,
                    count: plant.count,
                    unitCost,
                    totalCost,
                    priceCategory,
                    economicValue: plant.economic_value || 'medium'
                });
                
                layerCosts[layer].total += totalCost;
                totalSpeciesCost += totalCost;
            });
        });

        return { layerCosts, totalSpeciesCost, priceRanges };
    };

    const { layerCosts, totalSpeciesCost, priceRanges } = calculateSpeciesCosts();

    // Calculate other project costs
    const soilCost = (projectInfo.plantingArea && projectInfo.plantingArea > 0) 
        ? projectInfo.plantingArea * costs.soilAmendmentPerM2 
        : 0;
    const laborCost = 10 * costs.laborPerDay;
    const maintenanceCost = 36 * costs.maintenanceMonthly;
    const totalProjectCost = totalSpeciesCost + soilCost + laborCost + maintenanceCost;

    // Data for pie chart
    const pieData = [
        { name: 'Plants', value: totalSpeciesCost, color: '#16a34a' },
        { name: 'Soil', value: soilCost, color: '#22c55e' },
        { name: 'Labor', value: laborCost, color: '#4ade80' },
        { name: 'Maintenance', value: maintenanceCost, color: '#86efac' }
    ];

    // Data for layer cost bar chart
    const layerBarData = Object.entries(layerCosts).map(([layer, data]) => ({
        layer: layer.charAt(0).toUpperCase() + layer.slice(1),
        cost: data.total,
        plants: data.plants.length
    }));

    return (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost Analysis</h2>

        {/* Species Price Distribution */}
        <div className="mb-8 bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Species Price Distribution</h3>
            <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(priceRanges).map(([range, data]) => (
                    <div key={range} className="p-4 rounded-lg border-2" style={{ borderColor: data.color, backgroundColor: data.color + '10' }}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold" style={{ color: data.color, fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                {data.label}
                            </span>
                            <span className="text-lg font-bold" style={{ color: data.color }}>
                                {data.count}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                            {data.count} plants selected
                        </p>
                        <p className="text-xs mt-2 font-medium" style={{ color: data.color }}>
                            Total: ৳{data.total.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                    💡 <strong>Hybrid Pricing:</strong> Prices from database with manual override capability. Edit individual prices in the Species tab.
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Project Cost Breakdown Pie Chart */}
            <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Project Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ৳${(value / 1000).toFixed(1)}k`}
                            outerRadius={100}
                            innerRadius={40}
                            fill="#8884d8"
                            dataKey="value"
                            stroke="#ffffff"
                            strokeWidth={2}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => [`৳${value.toLocaleString()}`, 'Cost']}
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

            {/* Layer Cost Distribution */}
            <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost by Forest Layer</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={layerBarData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                        <XAxis 
                            dataKey="layer" 
                            tick={{ fontFamily: 'Crimson Pro, Georgia, serif', fill: '#166534', fontSize: 12 }}
                        />
                        <YAxis 
                            tick={{ fontFamily: 'Crimson Pro, Georgia, serif', fill: '#166534' }}
                            tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip 
                            formatter={(value) => [`৳${value.toLocaleString()}`, 'Cost']}
                            contentStyle={{
                                backgroundColor: '#f0fdf4',
                                border: '2px solid #16a34a',
                                borderRadius: '8px',
                                fontFamily: 'Crimson Pro, Georgia, serif'
                            }}
                        />
                        <Bar dataKey="cost" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Other Project Costs */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Other Project Costs (BDT)</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Soil Amendment (per m²)</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳</span>
                            <input
                                type="number"
                                value={costs.soilAmendmentPerM2}
                                onChange={(e) => setCosts({ ...costs, soilAmendmentPerM2: Number(e.target.value) })}
                                className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-right text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Labor (per day)</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳</span>
                            <input
                                type="number"
                                value={costs.laborPerDay}
                                onChange={(e) => setCosts({ ...costs, laborPerDay: Number(e.target.value) })}
                                className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-right text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Monthly Maintenance</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳</span>
                            <input
                                type="number"
                                value={costs.maintenanceMonthly}
                                onChange={(e) => setCosts({ ...costs, maintenanceMonthly: Number(e.target.value) })}
                                className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-right text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost Summary</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                        <p className="text-3xl font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳{totalProjectCost.toLocaleString()}</p>
                        <p className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Total Project Cost</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                            <p className="text-xl font-bold text-blue-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>${(totalProjectCost / 109).toFixed(0)}</p>
                            <p className="text-blue-700 text-sm font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>USD</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
                            <p className="text-xl font-bold text-purple-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳{Math.round(totalProjectCost / totalPlants)}</p>
                            <p className="text-purple-700 text-sm font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Per Plant</p>
                        </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center">
                            <span className="text-yellow-800 font-semibold text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost per m²:</span>
                            <span className="font-bold text-yellow-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳{Math.round(totalProjectCost / (projectInfo.totalArea || 1))}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Species Breakdown */}
        <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Detailed Species Cost Breakdown</h3>
            
            {Object.entries(layerCosts).map(([layer, layerData]) => (
                <div key={layer} className="mb-6">
                    <h4 className="text-md font-semibold mb-4 capitalize text-green-700" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        {layer} Layer - ৳{layerData.total.toLocaleString()} ({layerData.plants.length} species)
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {layerData.plants.map((plant, index) => (
                            <div key={index} className={`p-4 rounded-lg border-2 ${
                                plant.priceCategory === 'high' ? 'bg-green-50 border-green-300' :
                                plant.priceCategory === 'medium' ? 'bg-yellow-50 border-yellow-300' :
                                'bg-gray-50 border-gray-300'
                            }`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-green-800 text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                        {plant.name}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                                        plant.priceCategory === 'high' ? 'bg-green-200 text-green-800' :
                                        plant.priceCategory === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                        'bg-gray-200 text-gray-800'
                                    }`}>
                                        ৳{plant.unitCost}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-green-600">Quantity:</span>
                                        <span className="font-medium">{plant.count}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-1">
                                        <span className="text-green-800 font-semibold">Total:</span>
                                        <span className="font-bold">৳{plant.totalCost.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

export default Costs;