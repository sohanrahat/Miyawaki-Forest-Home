
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Costs = ({ costs, setCosts, costBreakdown, totalPlants, projectInfo }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost Analysis</h2>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
                <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost Parameters (BDT)</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Plant Cost (per unit)</span>
                        <div className="flex items-center gap-2">
                            <span className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳</span>
                            <input
                                type="number"
                                value={costs.plantCostPerUnit}
                                onChange={(e) => setCosts({ ...costs, plantCostPerUnit: Number(e.target.value) })}
                                className="w-24 px-3 py-2 border-2 border-green-300 rounded-lg text-right text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                            />
                        </div>
                    </div>
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
                <h3 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={[
                                { name: 'Plants', value: costBreakdown.plants },
                                { name: 'Soil', value: costBreakdown.soil },
                                { name: 'Labor', value: costBreakdown.labor },
                                { name: 'Maintenance', value: costBreakdown.maintenance }
                            ]}
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
                            {['#16a34a', '#22c55e', '#4ade80', '#86efac'].map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                            ))}
                        </Pie>

                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Total Investment Summary</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-3xl font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳{costBreakdown.total.toLocaleString()}</p>
                    <p className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Total Project Cost</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                    <p className="text-3xl font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>${(costBreakdown.total / 109).toFixed(0)}</p>
                    <p className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>USD Equivalent</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost per plant:</span>
                    <span className="font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳{(costBreakdown.total / totalPlants).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Cost per m²:</span>
                    <span className="font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>৳{(costBreakdown.total / projectInfo.plantingArea).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>ROI Timeline:</span>
                    <span className="font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>4-5 years (food production value)</span>
                </div>
            </div>
        </div>
    </div>
);

export default Costs;
