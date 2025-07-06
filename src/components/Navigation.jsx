
const Navigation = ({ activeTab, setActiveTab, siteInfoConfirmed, speciesSelectionConfirmed }) => {
    const blueprintEnabled = siteInfoConfirmed && speciesSelectionConfirmed;
    
    return (
    <div className="bg-green-50 rounded-xl shadow-md mb-6 border border-green-200">
        <div className="flex justify-between items-center p-4">
            {/* Logo and App Name - Left Side */}
            <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                    <span className="text-2xl">🌳</span>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-green-800" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        Miyawaki Forest Planner
                    </h1>
                    <p className="text-sm text-green-600" style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}>
                        Smart Forest Design Tool
                    </p>
                </div>
            </div>

            {/* Navigation Menu - Right Side */}
            <div className="flex items-center space-x-1">
                {['overview', 'species', 'timeline', 'costs', 'blueprint'].map((tab) => {
                    const isDisabled = (tab === 'blueprint' || tab === 'timeline') && !blueprintEnabled;
                    
                    return (
                        <button
                            key={tab}
                            onClick={() => !isDisabled && setActiveTab(tab)}
                            disabled={isDisabled}
                            className={`px-4 py-2 capitalize rounded-lg transition-all duration-300 ${
                                activeTab === tab
                                    ? 'bg-green-600 text-white font-bold shadow-md'
                                    : isDisabled
                                    ? 'text-gray-400 font-medium cursor-not-allowed opacity-50'
                                    : 'text-green-700 font-medium hover:bg-green-200 hover:text-green-900'
                            }`}
                            style={{ fontFamily: 'Crimson Pro, Georgia, serif' }}
                            title={isDisabled ? 'Complete Project Info and Species Selection first' : ''}
                        >
                            {tab === 'overview' && '📊'}
                            {tab === 'species' && '🌱'}
                            {tab === 'timeline' && '📅'}
                            {tab === 'costs' && '💰'}
                            {tab === 'blueprint' && '🗺️'}
                            <span className="ml-2">{tab}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
    );
};

export default Navigation;
