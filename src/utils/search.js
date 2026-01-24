
import { getAllRecipes, getSelectedFilters } from './state.js';

export function searchRecipes(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm || searchTerm.length < 3) {
        return getAllRecipes();
    }

    return getAllRecipes().filter(recipe => {
        if (recipe.name.toLowerCase().includes(searchTerm)) {
            return true;
        }

        if (recipe.description.toLowerCase().includes(searchTerm)) {
            return true;
        }

        const hasIngredient = recipe.ingredients.some(item =>
            item.ingredient.toLowerCase().includes(searchTerm)
        );

        if (hasIngredient) {
            return true;
        }

        if (recipe.appliance && recipe.appliance.toLowerCase().includes(searchTerm)) {
            return true;
        }

        const hasUstensil = recipe.ustensils.some(ustensil =>
            ustensil.toLowerCase().includes(searchTerm)
        );

        return hasUstensil;
    });
}

export function filterRecipesByTags(recipes, filters) {
    return recipes.filter(recipe => {
        const matchesIngredients = filters.ingredients.length === 0 || 
            filters.ingredients.every(selectedIngredient => 
                recipe.ingredients.some(item => 
                    item.ingredient.toLowerCase() === selectedIngredient.toLowerCase()
                )
            );

        const matchesAppliances = filters.appliances.length === 0 || 
            filters.appliances.some(selectedAppliance => 
                recipe.appliance && recipe.appliance.toLowerCase() === selectedAppliance.toLowerCase()
            );

        const matchesUstensils = filters.ustensils.length === 0 || 
            filters.ustensils.every(selectedUstensil => 
                recipe.ustensils.some(ustensil => 
                    ustensil.toLowerCase() === selectedUstensil.toLowerCase()
                )
            );

        return matchesIngredients && matchesAppliances && matchesUstensils;
    });
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

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(item => {
            ingredients.add(item.ingredient.toLowerCase());
        });

        if (recipe.appliance) {
            appliances.add(recipe.appliance.toLowerCase());
        }
        recipe.ustensils.forEach(ustensil => {
            ustensils.add(ustensil.toLowerCase());
        });
    });

    return {
        ingredients: Array.from(ingredients).sort(),
        appliances: Array.from(appliances).sort(),
        ustensils: Array.from(ustensils).sort()
    };
}

