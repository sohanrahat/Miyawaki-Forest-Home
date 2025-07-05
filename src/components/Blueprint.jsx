
import { GiTreeGrowth, GiSunflower, GiWaterDrop } from 'react-icons/gi';
import { FaHome } from 'react-icons/fa';

const Blueprint = ({ totalPlants }) => {
    // Generate dense, mixed planting pattern following Miyawaki principles
    const generatePlants = () => {
        const plants = [];
        const centerX = 400;
        const centerY = 300;
        const houseX = 400;
        const houseY = 520;
        
        // Create concentric circles of dense planting around the house
        for (let radius = 80; radius < 320; radius += 15) {
            const circumference = 2 * Math.PI * radius;
            const plantsInRing = Math.floor(circumference / 12); // Dense spacing
            
            for (let i = 0; i < plantsInRing; i++) {
                const angle = (i / plantsInRing) * 2 * Math.PI + (Math.random() - 0.5) * 0.3;
                const x = houseX + Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
                const y = houseY + Math.sin(angle) * radius + (Math.random() - 0.5) * 20;
                
                // Skip if too close to pathways or outside bounds
                if (x < 70 || x > 730 || y < 70 || y > 530) continue;
                if (Math.abs(x - 400) < 25 && y > 400) continue; // Main path
                
                // Determine layer based on distance from house (closer = smaller plants)
                let layer, size, color;
                const distanceFromHouse = Math.sqrt((x - houseX) ** 2 + (y - houseY) ** 2);
                
                if (distanceFromHouse < 120) {
                    // Ground layer - herbs, vegetables
                    layer = 'ground';
                    size = 2 + Math.random() * 2;
                    color = '#92b885'; // forest-300
                } else if (distanceFromHouse < 180) {
                    // Shrub layer
                    layer = 'shrub';
                    size = 4 + Math.random() * 3;
                    color = '#D1A980'; // earth-400
                } else if (distanceFromHouse < 240) {
                    // Sub-canopy
                    layer = 'subcanopy';
                    size = 6 + Math.random() * 4;
                    color = '#748873'; // forest-400
                } else {
                    // Canopy layer - tallest trees on perimeter
                    layer = 'canopy';
                    size = 8 + Math.random() * 4;
                    color = '#5a6b58'; // forest-500
                }
                
                plants.push({ x, y, size, color, layer });
            }
        }
        
        return plants.slice(0, Math.min(plants.length, totalPlants));
    };
    
    const plants = generatePlants();
    
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Miyawaki Forest Blueprint</h2>
            <p className="text-green-600 mb-4" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Dense, mixed-species planting following natural forest principles</p>

            <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg" style={{ aspectRatio: '4/3' }}>
                <svg viewBox="0 0 800 600" className="w-full h-full">
                    {/* Grid Background */}
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d4cfc5" strokeWidth="0.5" opacity="0.5" />
                        </pattern>
                        <radialGradient id="forestGradient" cx="50%" cy="85%" r="60%">
                            <stop offset="0%" stopColor="#f0f4f0" />
                            <stop offset="50%" stopColor="#d9e5d6" />
                            <stop offset="100%" stopColor="#b8d1b0" />
                        </radialGradient>
                    </defs>

                    {/* Plot Background */}
                    <rect x="50" y="50" width="700" height="500" fill="url(#forestGradient)" stroke="#748873" strokeWidth="2" />
                    <rect x="50" y="50" width="700" height="500" fill="url(#grid)" />

                    {/* Property Boundary */}
                    <rect x="50" y="50" width="700" height="500" fill="none" stroke="#475447" strokeWidth="3" strokeDasharray="15,5" />

                    {/* House */}
                    <g transform="translate(400, 480)">
                        <circle cx="0" cy="0" r="25" fill="#D1A980" stroke="#748873" strokeWidth="2" />
                        <foreignObject x="-12" y="-12" width="24" height="24">
                            <FaHome size={24} color="#748873" />
                        </foreignObject>
                        <text x="0" y="40" textAnchor="middle" fill="#748873" fontWeight="bold" fontSize="10">HOUSE</text>
                    </g>



                    {/* Dense Plant Distribution */}
                    {plants.map((plant, i) => (
                        <circle 
                            key={i} 
                            cx={plant.x} 
                            cy={plant.y} 
                            r={plant.size} 
                            fill={plant.color} 
                            opacity="0.8"
                            stroke="white"
                            strokeWidth="0.5"
                        />
                    ))}

                    {/* Layer Indicators */}
                    <g transform="translate(80, 80)">
                        <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#748873">CANOPY</text>
                        <text x="0" y="12" fontSize="8" fill="#5a6b58">Mango, Jackfruit, Coconut</text>
                    </g>
                    <g transform="translate(80, 120)">
                        <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#D1A980">SUB-CANOPY</text>
                        <text x="0" y="12" fontSize="8" fill="#b8935f">Guava, Papaya, Drumstick</text>
                    </g>
                    <g transform="translate(80, 160)">
                        <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#92b885">SHRUB</text>
                        <text x="0" y="12" fontSize="8" fill="#748873">Chili, Tomato, Lemon</text>
                    </g>
                    <g transform="translate(80, 200)">
                        <text x="0" y="0" fontSize="10" fontWeight="bold" fill="#92b885">GROUND</text>
                        <text x="0" y="12" fontSize="8" fill="#748873">Spinach, Ginger, Herbs</text>
                    </g>

                    {/* Density Indicator */}
                    <text x="400" y="80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#748873">
                        {plants.length} plants • {(plants.length / 2.78).toFixed(1)} plants/m²
                    </text>

                    {/* Scale */}
                    <line x1="580" y1="500" x2="660" y2="500" stroke="white" strokeWidth="2" />
                    <text x="620" y="515" textAnchor="middle" fontSize="10" fill="white">8 meters</text>

                    {/* North Arrow */}
                    <g transform="translate(720, 100)">
                        <circle cx="0" cy="0" r="20" fill="white" stroke="#748873" strokeWidth="2" />
                        <path d="M 0,-15 L -6,0 L 0,-4 L 6,0 Z" fill="#748873" />
                        <text x="0" y="10" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#748873">N</text>
                    </g>
                </svg>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl border-2 border-green-200 shadow-lg">
                    <h4 className="font-semibold mb-3 flex items-center text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        <GiTreeGrowth className="mr-3 text-green-600" size={20} />
                        Miyawaki Density
                    </h4>
                    <p className="text-sm text-green-700" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        3+ plants per m² in mixed layers, creating a self-sustaining ecosystem 
                        that grows 10x faster than conventional forests
                    </p>
                </div>
                <div className="p-6 bg-white rounded-xl border-2 border-green-200 shadow-lg">
                    <h4 className="font-semibold mb-3 flex items-center text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        <GiSunflower className="mr-3 text-green-600" size={20} />
                        Natural Layering
                    </h4>
                    <p className="text-sm text-green-700" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        4 distinct layers from ground herbs to canopy trees, 
                        maximizing space utilization and biodiversity
                    </p>
                </div>
                <div className="p-6 bg-white rounded-xl border-2 border-green-200 shadow-lg">
                    <h4 className="font-semibold mb-3 flex items-center text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        <FaHome className="mr-3 text-green-600" size={18} />
                        Home Integration
                    </h4>
                    <p className="text-sm text-green-700" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        Forest surrounds the home completely, providing food, 
                        cooling, and natural pest control year-round
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Blueprint;
