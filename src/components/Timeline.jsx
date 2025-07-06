
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Timeline = ({ harvestTimeline, plants }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Harvest Timeline</h2>

        <div className="mb-8 bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Fruiting Plants Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={harvestTimeline()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                    <XAxis 
                        dataKey="year" 
                        tick={{ fontFamily: 'Crimson Pro, Georgia, serif', fill: '#166534' }}
                    />
                    <YAxis 
                        tick={{ fontFamily: 'Crimson Pro, Georgia, serif', fill: '#166534' }}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: '#f0fdf4',
                            border: '2px solid #16a34a',
                            borderRadius: '8px',
                            fontFamily: 'Crimson Pro, Georgia, serif'
                        }}
                    />
                    <Legend 
                        wrapperStyle={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="plants"
                        stroke="#16a34a"
                        strokeWidth={3}
                        name="Fruiting Plants"
                        dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#22c55e' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Monthly Harvest Calendar</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => {
                    const harvestingPlants = [];
                    Object.values(plants).forEach(plantList => {
                        plantList.forEach(plant => {
                            if (plant.harvest_month &&
                                (plant.harvest_month.includes(month) ||
                                    plant.harvest_month === 'Year-round')) {
                                harvestingPlants.push(plant.name);
                            }
                        });
                    });

                    return (
                        <div key={month} className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            harvestingPlants.length > 5 ? 'bg-green-600 text-white border-green-600 shadow-md' :
                                harvestingPlants.length > 0 ? 'bg-green-100 text-green-800 border-green-300' :
                                    'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                            <p className="font-bold text-center" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>{month}</p>
                            <p className="text-sm text-center mt-1 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                {harvestingPlants.length} species
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Production Timeline</h3>
            <div className="space-y-4">
                {(() => {
                    // Categorize plants by years to fruit
                    const timeCategories = {
                        immediate: { label: 'Immediate (0-6 months)', plants: [], color: 'bg-green-50' },
                        shortTerm: { label: 'Short-term (6-18 months)', plants: [], color: 'bg-yellow-50' },
                        mediumTerm: { label: 'Medium-term (2-4 years)', plants: [], color: 'bg-orange-50' },
                        longTerm: { label: 'Long-term (5+ years)', plants: [], color: 'bg-red-50' }
                    };

                    // Sort plants into categories
                    Object.values(plants).forEach(plantList => {
                        plantList.forEach(plant => {
                            if (plant.years_to_fruit <= 0.5) {
                                timeCategories.immediate.plants.push(plant.name);
                            } else if (plant.years_to_fruit <= 1.5) {
                                timeCategories.shortTerm.plants.push(plant.name);
                            } else if (plant.years_to_fruit <= 4) {
                                timeCategories.mediumTerm.plants.push(plant.name);
                            } else if (plant.years_to_fruit > 4) {
                                timeCategories.longTerm.plants.push(plant.name);
                            }
                        });
                    });

                    return Object.values(timeCategories).map((category, index) => (
                        <div key={index} className={`p-4 ${category.color} rounded-lg border border-green-200`}>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    {category.label}:
                                </span>
                                <span className="font-medium text-green-700 text-right" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                    {category.plants.length > 0 ? category.plants.join(', ') : 'None selected'}
                                </span>
                            </div>
                        </div>
                    ));
                })()}
            </div>
        </div>
    </div>
);

export default Timeline;
