
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Timeline = ({ harvestTimeline, plants }) => {
    // Add safety checks
    if (!plants || typeof plants !== 'object') {
        return <div className="text-red-600">Error: Plants data is missing or invalid</div>;
    }
    
    if (!harvestTimeline || !Array.isArray(harvestTimeline)) {
        return <div className="text-red-600">Error: Harvest timeline data is missing or invalid</div>;
    }

    return (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Harvest Timeline</h2>

        <div className="mb-8 bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Fruiting Plants Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={harvestTimeline}>
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
                    const monthMap = {
                        'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
                        'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
                        'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
                    };
                    const fullMonthName = monthMap[month];
                    
                    Object.values(plants).forEach(plantList => {
                        if (Array.isArray(plantList)) {
                            plantList.forEach(plant => {
                                if (plant && plant.harvest_months && plant.name && plant.count > 0 &&
                                    Array.isArray(plant.harvest_months) &&
                                    plant.harvest_months.includes(fullMonthName)) {
                                    harvestingPlants.push(plant.name);
                                }
                            });
                        }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                    // Categorize plants by years to fruit
                    const timeCategories = {
                        immediate: { 
                            label: 'Immediate Harvest', 
                            subtitle: '0-6 months', 
                            plants: [], 
                            bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
                            borderColor: 'border-green-300',
                            iconColor: 'text-green-600',
                            icon: '🌱'
                        },
                        shortTerm: { 
                            label: 'Short-term Harvest', 
                            subtitle: '6-18 months', 
                            plants: [], 
                            bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
                            borderColor: 'border-yellow-300',
                            iconColor: 'text-yellow-600',
                            icon: '🌿'
                        },
                        mediumTerm: { 
                            label: 'Medium-term Harvest', 
                            subtitle: '2-4 years', 
                            plants: [], 
                            bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
                            borderColor: 'border-orange-300',
                            iconColor: 'text-orange-600',
                            icon: '🌳'
                        },
                        longTerm: { 
                            label: 'Long-term Harvest', 
                            subtitle: '5+ years', 
                            plants: [], 
                            bgColor: 'bg-gradient-to-br from-red-50 to-red-100',
                            borderColor: 'border-red-300',
                            iconColor: 'text-red-600',
                            icon: '🌲'
                        }
                    };

                    // Sort plants into categories
                    Object.values(plants).forEach(plantList => {
                        if (Array.isArray(plantList)) {
                            plantList.forEach(plant => {
                                if (plant && plant.name && plant.count > 0 && typeof plant.years_to_fruit === 'number') {
                                    if (plant.years_to_fruit <= 0.5) {
                                        timeCategories.immediate.plants.push(plant.name);
                                    } else if (plant.years_to_fruit <= 1.5) {
                                        timeCategories.shortTerm.plants.push(plant.name);
                                    } else if (plant.years_to_fruit <= 4) {
                                        timeCategories.mediumTerm.plants.push(plant.name);
                                    } else if (plant.years_to_fruit > 4) {
                                        timeCategories.longTerm.plants.push(plant.name);
                                    }
                                }
                            });
                        }
                    });

                    return Object.values(timeCategories).map((category, index) => (
                        <div key={index} className={`p-6 ${category.bgColor} rounded-xl border-2 ${category.borderColor} shadow-md hover:shadow-lg transition-all duration-300`}>
                            <div className="flex items-center mb-4">
                                <span className="text-2xl mr-3">{category.icon}</span>
                                <div>
                                    <h4 className="font-bold text-green-800 text-lg" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                        {category.label}
                                    </h4>
                                    <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                        {category.subtitle}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white/70 rounded-lg p-4 border border-white/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-green-700 text-sm" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                        Species Count:
                                    </span>
                                    <span className={`font-bold text-lg ${category.iconColor}`} style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                        {category.plants.length}
                                    </span>
                                </div>
                                {category.plants.length > 0 ? (
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-600 mb-2 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Plants:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {category.plants.map((plant, plantIndex) => (
                                                <span key={plantIndex} className="inline-block bg-white px-2 py-1 rounded-full text-xs font-medium text-green-700 border border-green-200 shadow-sm">
                                                    {plant}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic mt-2" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                                        No plants selected for this timeline
                                    </p>
                                )}
                            </div>
                        </div>
                    ));
                })()}
            </div>
        </div>
    </div>
    );
};

export default Timeline;
