
import { recipes } from '../../data/recipes.js';

const state = {
    allRecipes: recipes, 
    filteredRecipes: [...recipes], 
    searchQuery: '', 
    selectedFilters: {
        ingredients: [],
        appliances: [],
        ustensils: []
    }
};

export function getState() {
    return state;
}

export function setSearchQuery(query) {
    state.searchQuery = query.toLowerCase().trim();
}

export function getSearchQuery() {
    return state.searchQuery;
}

export function getAllRecipes() {
    return state.allRecipes;
}

export function getFilteredRecipes() {
    return state.filteredRecipes;
}

export function setFilteredRecipes(recipes) {
    state.filteredRecipes = recipes;
}

export function addFilter(type, value) {
    if (!state.selectedFilters[type].includes(value)) {
        state.selectedFilters[type].push(value);
    }
}

export function removeFilter(type, value) {
    state.selectedFilters[type] = state.selectedFilters[type].filter(item => item !== value);
}

export function getSelectedFilters() {
    return state.selectedFilters;
}
