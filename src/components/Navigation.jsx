
const Navigation = ({ activeTab, setActiveTab }) => (
    <div className="bg-green-50 rounded-xl shadow-md mb-6 border border-green-200">
        <div className="flex flex-wrap p-2 gap-2">
            {['overview', 'species', 'timeline', 'costs', 'blueprint'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 capitalize transition-all duration-300 ${
                        activeTab === tab
                            ? 'text-green-900 font-bold'
                            : 'text-green-700 font-medium hover:text-green-900'
                    }`}
                    style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                >
                    {tab}
                </button>
            ))}
        </div>
    </div>
);

export default Navigation;
