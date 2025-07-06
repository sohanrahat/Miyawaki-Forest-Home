
import { GiTreeGrowth, GiPlantSeed } from 'react-icons/gi';
import { FaTrash } from 'react-icons/fa';


const Species = ({ plants, totalByLayer, addNewSpecies, setPlants, deleteSpecies }) => {

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
                                <th className="text-center p-4 text-green-800 font-semibold" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantList.map((plant, index) => (
                                <tr key={index} className="border-b border-green-200 hover:bg-green-50 transition-colors">
                                    <td className="p-4">
                                        <input
                                            type="text"
                                            value={plant.name}
                                            onChange={(e) => updatePlantProperty(layer, index, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                        />
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
                                        <select
                                            value={plant.harvest_month}
                                            onChange={(e) => updatePlantProperty(layer, index, 'harvest_month', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-green-300 rounded-lg text-green-900 focus:border-green-500 focus:outline-none font-medium"
                                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                                        >
                                            <option value="">N/A</option>
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                        </select>
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
