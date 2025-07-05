
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GiWaterDrop } from 'react-icons/gi';

const Overview = ({ pieData, projectInfo, setProjectInfo }) => (
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
                            {pieData.map((entry, index) => (
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
                <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Site Information</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Total Area</span>
                        <input
                            type="number"
                            value={projectInfo.totalArea}
                            onChange={(e) => setProjectInfo({ ...projectInfo, totalArea: Number(e.target.value) })}
                            className="px-3 py-2 border-2 border-green-300 rounded-lg text-center text-green-900 focus:border-green-500 focus:outline-none font-semibold bg-white"
                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                        />
                        <span className="text-green-700 font-medium text-right" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>m²</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Planting Area</span>
                        <input
                            type="number"
                            value={projectInfo.plantingArea}
                            onChange={(e) => setProjectInfo({ ...projectInfo, plantingArea: Number(e.target.value) })}
                            className="px-3 py-2 border-2 border-green-300 rounded-lg text-center text-green-900 focus:border-green-500 focus:outline-none font-semibold bg-white"
                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                        />
                        <span className="text-green-700 font-medium text-right" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>m²</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Location</span>
                        <input
                            type="text"
                            value={projectInfo.location}
                            onChange={(e) => setProjectInfo({ ...projectInfo, location: e.target.value })}
                            className="col-span-2 px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium bg-white"
                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                        />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Soil Type</span>
                        <select
                            value={projectInfo.soilType}
                            onChange={(e) => setProjectInfo({ ...projectInfo, soilType: e.target.value })}
                            className="col-span-2 px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium bg-white"
                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                        >
                            <option>Alluvial</option>
                            <option>Clay</option>
                            <option>Sandy</option>
                            <option>Loamy</option>
                        </select>
                    </div>
                </div>
            </div>
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

export default Overview;
