/**
 * Utility functions for species database management
 */

// Get available regions
export const getAvailableRegions = (speciesDatabase) => {
    return Object.keys(speciesDatabase.regions);
};

// Get region information
export const getRegionInfo = (speciesDatabase, regionId) => {
    return speciesDatabase.regions[regionId];
};

// Get species by region and layer
export const getSpeciesByRegionAndLayer = (speciesDatabase, regionId, layer) => {
    const region = speciesDatabase.regions[regionId];
    return region ? region.layers[layer] || [] : [];
};

// Get all species for a region
export const getAllSpeciesForRegion = (speciesDatabase, regionId) => {
    const region = speciesDatabase.regions[regionId];
    return region ? region.layers : {};
};

// Filter species by criteria
export const filterSpecies = (species, criteria) => {
    return species.filter(spec => {
        // Filter by native status
        if (criteria.native !== undefined && spec.native !== criteria.native) {
            return false;
        }
        
        // Filter by economic value
        if (criteria.economicValue && spec.economic_value !== criteria.economicValue) {
            return false;
        }
        
        // Filter by drought tolerance
        if (criteria.droughtTolerance && spec.drought_tolerance !== criteria.droughtTolerance) {
            return false;
        }
        
        // Filter by flood tolerance
        if (criteria.floodTolerance && spec.flood_tolerance !== criteria.floodTolerance) {
            return false;
        }
        
        // Filter by soil type
        if (criteria.soilType && !spec.soil_types.includes(criteria.soilType)) {
            return false;
        }

        // Filter by sun exposure (derived from avgTemp)
        if (criteria.sunExposure && spec.sun_exposure !== criteria.sunExposure) {
            return false;
        }

        // Filter by water needs (derived from annualRainfall)
        if (criteria.waterNeeds && spec.water_needs !== criteria.waterNeeds) {
            return false;
        }
        
        // Filter by height range
        if (criteria.minHeight && spec.mature_height < criteria.minHeight) {
            return false;
        }
        if (criteria.maxHeight && spec.mature_height > criteria.maxHeight) {
            return false;
        }
        
        // Filter by fruiting time
        if (criteria.maxFruitingTime && spec.years_to_fruit > criteria.maxFruitingTime) {
            return false;
        }
        
        return true;
    });
};

// Get recommended species combinations for balanced ecosystem
export const getRecommendedCombination = (speciesDatabase, regionId, preferences = {}) => {
    const region = speciesDatabase.regions[regionId];
    if (!region) return {};
    
    const recommendations = {};
    
    Object.entries(region.layers).forEach(([layer, species]) => {
        let filteredSpecies = species;
        
        // Apply preferences
        if (preferences.prioritizeNative) {
            filteredSpecies = filteredSpecies.filter(s => s.native);
        }
        
        if (preferences.prioritizeFood) {
            filteredSpecies = filteredSpecies.filter(s => 
                s.uses.includes('fruit') || 
                s.uses.includes('vegetable') || 
                s.uses.includes('spice') ||
                s.uses.includes('leafy_vegetable')
            );
        }
        
        if (preferences.soilType) {
            filteredSpecies = filteredSpecies.filter(s => 
                s.soil_types.includes(preferences.soilType)
            );
        }
        
        // Select diverse species for each layer
        let selectedCount;
        switch(layer) {
            case 'canopy':
                selectedCount = Math.min(6, filteredSpecies.length);
                break;
            case 'subcanopy':
                selectedCount = Math.min(8, filteredSpecies.length);
                break;
            case 'shrub':
                selectedCount = Math.min(8, filteredSpecies.length);
                break;
            case 'ground':
                selectedCount = Math.min(6, filteredSpecies.length);
                break;
            default:
                selectedCount = Math.min(6, filteredSpecies.length);
        }
        
        // Shuffle and select
        const shuffled = [...filteredSpecies].sort(() => 0.5 - Math.random());
        recommendations[layer] = shuffled.slice(0, selectedCount);
    });
    
    return recommendations;
};

// Transform species data for component compatibility
export const transformSpeciesForComponent = (species) => ({
    name: species.name,
    years_to_fruit: species.years_to_fruit,
    harvest_month: species.harvest_months.length > 0 ? species.harvest_months.join(', ') : 'N/A',
    mature_height: species.mature_height,
    scientific_name: species.scientific_name,
    native: species.native,
    economic_value: species.economic_value,
    uses: species.uses,
    nutritional_benefits: species.nutritional_benefits,
    drought_tolerance: species.drought_tolerance,
    flood_tolerance: species.flood_tolerance,
    soil_types: species.soil_types
});

// Get database metadata
export const getDatabaseMetadata = (speciesDatabase) => {
    return speciesDatabase.metadata;
};

// Search species by name
export const searchSpeciesByName = (speciesDatabase, regionId, searchTerm) => {
    const region = speciesDatabase.regions[regionId];
    if (!region) return [];
    
    const allSpecies = Object.values(region.layers).flat();
    return allSpecies.filter(species => 
        species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.scientific_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

// Check for planting warnings
export const checkForPlantingWarnings = (selectedPlants, siteSoilType) => {
    const warnings = [];
    const allPlants = Object.values(selectedPlants).flat();

    // 1. Check for soil incompatibility
    if (siteSoilType) {
        allPlants.forEach(plant => {
            if (plant.soil_types && !plant.soil_types.includes(siteSoilType)) {
                warnings.push(`Warning: ${plant.name} may not thrive in ${siteSoilType} soil.`);
            }
        });
    }

    // 2. Check for negative companion plants
    allPlants.forEach(plant1 => {
        if (plant1.non_companion_plants && plant1.non_companion_plants.length > 0) {
            allPlants.forEach(plant2 => {
                if (plant1.id !== plant2.id) {
                    if (plant1.non_companion_plants.includes(plant2.id)) {
                        warnings.push(`Warning: ${plant1.name} and ${plant2.name} are not good companions and should not be planted together.`);
                    }
                }
            });
        }
    });

    return warnings;
};

// Get companion planting suggestions
export const getCompanionSuggestions = (selectedPlants, allSpecies) => {
    const suggestions = [];
    const allSelectedIds = Object.values(selectedPlants).flat().map(p => p.id);

    const allAvailablePlants = Object.values(allSpecies).flat();

    allSelectedIds.forEach(plantId => {
        const plant = allAvailablePlants.find(p => p.id === plantId);
        if (plant && plant.companion_plants) {
            plant.companion_plants.forEach(companionId => {
                if (!allSelectedIds.includes(companionId)) {
                    const companionPlant = allAvailablePlants.find(p => p.id === companionId);
                    if (companionPlant && !suggestions.some(s => s.id === companionPlant.id)) {
                        suggestions.push(companionPlant);
                    }
                }
            });
        }
    });

    return suggestions;
};

export default {
    getAvailableRegions,
    getRegionInfo,
    getSpeciesByRegionAndLayer,
    getAllSpeciesForRegion,
    filterSpecies,
    getRecommendedCombination,
    transformSpeciesForComponent,
    getDatabaseMetadata,
    searchSpeciesByName
};