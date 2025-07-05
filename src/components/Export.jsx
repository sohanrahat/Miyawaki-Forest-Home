
import { Save, Download } from 'lucide-react';

const Export = ({ projectInfo, plants, costs, totalPlants, density, costBreakdown }) => (
    <div className="mt-6 bg-white-smoke rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-4">
            <button className="px-6 py-2 bg-rich-black text-white rounded hover:bg-rich-black-dark flex items-center">
                <Save className="mr-2" size={16} /> Save Project
            </button>
            <button className="px-6 py-2 bg-camel text-white rounded hover:bg-camel-dark flex items-center">
                <Download className="mr-2" size={16} /> Export Data
            </button>
            <button
                onClick={() => {
                    const data = {
                        projectInfo,
                        plants,
                        costs,
                        totals: { totalPlants, density, costBreakdown }
                    };
                    console.log('Project Data:', data);
                    alert('Project data logged to console! Check developer tools.');
                }}
                className="px-6 py-2 bg-platinum text-rich-black rounded hover:bg-platinum-dark"
            >
                View JSON Data
            </button>
        </div>
    </div>
);

export default Export;
