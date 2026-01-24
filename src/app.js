import { getAllRecipes, getFilteredRecipes, setFilteredRecipes, setSearchQuery } from './utils/state.js';
import { getFilteredRecipes as getFilteredRecipesWithPriority } from './utils/search.js';
import { displayRecipes } from './components/recipeCard.js';
import { initializeDropdowns, updateAllDropdowns, clearDropdownFilters } from './components/dropdown.js';

function updateDisplay() {
    const recipes = getFilteredRecipes();

    displayRecipes(recipes);
    updateAllDropdowns(recipes);
    updateRecipeCounter(recipes.length);
}

function updateRecipeCounter(count) {
    const counter = document.querySelector('#recipe-counter');
    if (counter) {
        counter.textContent = `${count} recette${count !== 1 ? 's' : ''}`;
    }
}

function handleMainSearch(query) {
    if (query && query.trim().length >= 3) {
        clearDropdownFilters();
    }
    setSearchQuery(query);
    const filteredRecipes = getFilteredRecipesWithPriority(query);
    setFilteredRecipes(filteredRecipes);
    updateDisplay();
}


function initializeMainSearch() {
    const searchInput = document.querySelector('#main-search-input');

    if (!searchInput) {
        console.error('Input de recherche principal non trouvé');
        return;
    }

    const minCharsMessage = document.querySelector('#search-min-chars');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        if (query.length > 0 && query.length < 3) {
            minCharsMessage.classList.remove('hidden');
        } else {
            minCharsMessage.classList.add('hidden');
        }

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
