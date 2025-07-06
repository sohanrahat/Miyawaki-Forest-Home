
import { GiTreeGrowth, GiHourglass } from 'react-icons/gi';
import { MdGridOn } from 'react-icons/md';
import { FaCoins } from 'react-icons/fa';

const Header = ({ totalPlants, density, costBreakdown, projectInfo, plants, siteInfoConfirmed }) => {
    // Calculate years to self-sustain based on fastest producing plants
    const calculateYearsToSelfSustain = () => {
        if (!plants) return 3; // Default fallback
        
        let fastestFruiting = Infinity;
        
        Object.values(plants).forEach(layer => {
            layer.forEach(plant => {
                if (plant.years_to_fruit > 0) {
                    fastestFruiting = Math.min(fastestFruiting, plant.years_to_fruit);
                }
            });
        });
        
        // If 60% of plants are fruiting within 3 years, forest is self-sustaining
        // Otherwise, use the time when sufficient plants are producing
        const sustainabilityThreshold = totalPlants * 0.6;
        let producingPlants = 0;
        
        for (let year = 1; year <= 10; year++) {
            producingPlants = 0;
            Object.values(plants).forEach(layer => {
                layer.forEach(plant => {
                    if (plant.years_to_fruit > 0 && plant.years_to_fruit <= year) {
                        producingPlants += plant.count;
                    }
                });
            });
            
            if (producingPlants >= sustainabilityThreshold) {
                return year;
            }
        }
        
        return fastestFruiting === Infinity ? 3 : Math.ceil(fastestFruiting);
    };
    
    const yearsToSelfSustain = calculateYearsToSelfSustain();
    
    if (!siteInfoConfirmed) {
        return (
            <div className="bg-green-50 rounded-xl shadow-md p-6 mb-6 border border-green-200 text-center">
                <h1 className="text-3xl font-bold mb-2 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Miyawaki Forest Planner</h1>
                <p className="text-green-600" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Interactive planning tool for your food forest</p>
                
                <div className="mt-6">
                    <p className="text-green-700 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        📍 Please enter your site information in the Overview tab to see project metrics
                    </p>
                </div>
            </div>
        );
    }

    return (
    <div className="bg-green-50 rounded-xl shadow-md p-6 mb-6 border border-green-200 text-center">
        <h1 className="text-3xl font-bold mb-2 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Miyawaki Forest Planner</h1>
        <p className="text-green-600" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Interactive planning tool for your food forest in {projectInfo.location}</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-5 rounded-xl border-2 border-green-300 shadow-lg hover:shadow-xl hover:border-green-400 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <GiTreeGrowth className="text-green-500" size={28} />
                    <span className="text-3xl font-bold text-green-900">{totalPlants}</span>
                </div>
                <p className="text-sm text-green-800 mt-2 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Total Plants</p>
            </div>
            <div className="bg-white p-5 rounded-xl border-2 border-green-300 shadow-lg hover:shadow-xl hover:border-green-400 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <MdGridOn className="text-green-500" size={28} />
                    <span className="text-3xl font-bold text-green-900">{density}</span>
                </div>
                <p className="text-sm text-green-800 mt-2 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Plants/m²</p>
            </div>
            <div className="bg-white p-5 rounded-xl border-2 border-green-300 shadow-lg hover:shadow-xl hover:border-green-400 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <FaCoins className="text-green-500" size={28} />
                    <span className="text-3xl font-bold text-green-900">৳{(costBreakdown.total / 1000).toFixed(0)}k</span>
                </div>
                <p className="text-sm text-green-800 mt-2 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Total Cost</p>
            </div>
            <div className="bg-white p-5 rounded-xl border-2 border-green-300 shadow-lg hover:shadow-xl hover:border-green-400 transition-all duration-300">
                <div className="flex items-center justify-between">
                    <GiHourglass className="text-green-500" size={28} />
                    <span className="text-3xl font-bold text-green-900">{yearsToSelfSustain}</span>
                </div>
                <p className="text-sm text-green-800 mt-2 font-medium" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Years to Self-Sustain</p>
            </div>
        </div>
    </div>
    );
};

export default Header;
