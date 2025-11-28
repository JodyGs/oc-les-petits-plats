
import { getAllRecipes, getSelectedFilters } from './state.js';

export function searchRecipes(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm || searchTerm.length < 3) {
        return getAllRecipes();
    }

    const allRecipes = getAllRecipes();
    const results = [];
    
    for (let i = 0; i < allRecipes.length; i++) {
        const recipe = allRecipes[i];
        
        if (recipe.name.toLowerCase().includes(searchTerm)) {
            results.push(recipe);
            continue;
        }

        if (recipe.description.toLowerCase().includes(searchTerm)) {
            results.push(recipe);
            continue;
        }

        let hasIngredient = false;
        for (let j = 0; j < recipe.ingredients.length; j++) {
            if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchTerm)) {
                hasIngredient = true;
                break;
            }
        }
        
        if (hasIngredient) {
            results.push(recipe);
            continue;
        }

        if (recipe.appliance && recipe.appliance.toLowerCase().includes(searchTerm)) {
            results.push(recipe);
            continue;
        }

        let hasUstensil = false;
        for (let k = 0; k < recipe.ustensils.length; k++) {
            if (recipe.ustensils[k].toLowerCase().includes(searchTerm)) {
                hasUstensil = true;
                break;
            }
        }
        
        if (hasUstensil) {
            results.push(recipe);
        }
    }
    
    return results;
}

export function filterRecipesByTags(recipes, filters) {
    const results = [];
    
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        
        // Check ingredients
        let matchesIngredients = filters.ingredients.length === 0;
        if (!matchesIngredients) {
            let allIngredientsFound = true;
            for (let j = 0; j < filters.ingredients.length; j++) {
                const selectedIngredient = filters.ingredients[j];
                let found = false;
                for (let k = 0; k < recipe.ingredients.length; k++) {
                    if (recipe.ingredients[k].ingredient.toLowerCase() === selectedIngredient.toLowerCase()) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    allIngredientsFound = false;
                    break;
                }
            }
            matchesIngredients = allIngredientsFound;
        }

        // Check appliances
        let matchesAppliances = filters.appliances.length === 0;
        if (!matchesAppliances && recipe.appliance) {
            for (let j = 0; j < filters.appliances.length; j++) {
                if (recipe.appliance.toLowerCase() === filters.appliances[j].toLowerCase()) {
                    matchesAppliances = true;
                    break;
                }
            }
        }

        // Check ustensils
        let matchesUstensils = filters.ustensils.length === 0;
        if (!matchesUstensils) {
            let allUstensilsFound = true;
            for (let j = 0; j < filters.ustensils.length; j++) {
                const selectedUstensil = filters.ustensils[j];
                let found = false;
                for (let k = 0; k < recipe.ustensils.length; k++) {
                    if (recipe.ustensils[k].toLowerCase() === selectedUstensil.toLowerCase()) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    allUstensilsFound = false;
                    break;
                }
            }
            matchesUstensils = allUstensilsFound;
        }

        if (matchesIngredients && matchesAppliances && matchesUstensils) {
            results.push(recipe);
        }
    }
    
    return results;
}

export function getFilteredRecipes(searchQuery) {
    const filters = getSelectedFilters();
    
    let recipes;
    
    if (searchQuery && searchQuery.length >= 3) {
        recipes = searchRecipes(searchQuery);
    } else {
        recipes = getAllRecipes();
    }
    
    return filterRecipesByTags(recipes, filters);
}


export function extractOptionsFromRecipes(recipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        
        for (let j = 0; j < recipe.ingredients.length; j++) {
            ingredients.add(recipe.ingredients[j].ingredient.toLowerCase());
        }

        if (recipe.appliance) {
            appliances.add(recipe.appliance.toLowerCase());
        }
        
        for (let k = 0; k < recipe.ustensils.length; k++) {
            ustensils.add(recipe.ustensils[k].toLowerCase());
        }
    }

    return {
        ingredients: Array.from(ingredients).sort(),
        appliances: Array.from(appliances).sort(),
        ustensils: Array.from(ustensils).sort()
    };
}

