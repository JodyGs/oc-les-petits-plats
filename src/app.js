import { getAllRecipes, getFilteredRecipes, setFilteredRecipes, setSearchQuery } from './utils/state.js';
import { searchRecipes } from './utils/search.js';
import { displayRecipes } from './components/recipeCard.js';
import { initializeDropdowns, updateAllDropdowns } from './components/dropdown.js';

function updateDisplay() {
    const recipes = getFilteredRecipes();

    displayRecipes(recipes);
    updateAllDropdowns(recipes);
}


function handleMainSearch(query) {
    setSearchQuery(query);
    const filteredRecipes = searchRecipes(query);
    setFilteredRecipes(filteredRecipes);
    updateDisplay();
}


function initializeMainSearch() {
    const searchInput = document.querySelector('#main-search-input');

    if (!searchInput) {
        console.error('Input de recherche principal non trouvé');
        return;
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        handleMainSearch(query);
    });
}


function init() {
    const allRecipes = getAllRecipes();

    initializeDropdowns(allRecipes);
    displayRecipes(allRecipes);
    initializeMainSearch();
}

document.addEventListener('DOMContentLoaded', init);
