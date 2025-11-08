
import { getAllRecipes } from './state.js';

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

        return hasIngredient;
    });
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

