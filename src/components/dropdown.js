//TODO: La recherche input supprime les tags

import { extractOptionsFromRecipes, getFilteredRecipes } from '../utils/search.js';
import { addFilter, removeFilter, getSearchQuery, setFilteredRecipes, getSelectedFilters, clearAllFilters } from '../utils/state.js';
import { displayRecipes } from './recipeCard.js';

const dropdownConfig = {
    ingredients: { label: 'Ingrédients', placeholder: 'ingrédient' },
    appliances: { label: 'Appareils', placeholder: 'appareil' },
    ustensils: { label: 'Ustensiles', placeholder: 'ustensile' }
};

function handleTagSelection(type, value) {
    addFilter(type, value.toLowerCase());
    updateDisplay();
    renderSelectedTags();
}

function updateDisplay() {
    const searchQuery = getSearchQuery();
    const filteredRecipes = getFilteredRecipes(searchQuery);
    setFilteredRecipes(filteredRecipes);
    displayRecipes(filteredRecipes);
    updateAllDropdowns(filteredRecipes);
    updateRecipeCounter(filteredRecipes.length);
}

function updateRecipeCounter(count) {
    const counter = document.querySelector('#recipe-counter');
    if (counter) {
        counter.textContent = `${count} recette${count !== 1 ? 's' : ''}`;
    }
}

function renderSelectedTags() {
    const container = document.querySelector('.flex.gap-4.mb-8');
    const existingTagsContainer = container.querySelector('.selected-tags');
    
    if (existingTagsContainer) {
        existingTagsContainer.remove();
    }

    const selectedFilters = getSelectedFilters();
    const hasSelectedTags = Object.values(selectedFilters).some(arr => arr.length > 0);
    
    if (!hasSelectedTags) return;

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'selected-tags flex flex-wrap gap-2 w-full mb-4';
    
    Object.entries(selectedFilters).forEach(([type, tags]) => {
        tags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'flex items-center gap-2 px-3 py-1 bg-yellow rounded-lg text-sm';
            
            const tagText = document.createElement('span');
            tagText.textContent = tag;
            tagText.className = 'capitalize';
            
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.className = 'text-black hover:text-red-600 font-bold text-lg leading-none';
            
            closeButton.addEventListener('click', () => {
                removeFilter(type, tag);
                updateDisplay();
                renderSelectedTags();
            });
            
            tagElement.appendChild(tagText);
            tagElement.appendChild(closeButton);
            tagsContainer.appendChild(tagElement);
        });
    });
    
    container.insertBefore(tagsContainer, container.firstChild);
}

function createDropdownButton(type) {
    const container = document.createElement('div');
    container.className = 'relative';
    
    const button = document.createElement('button');
    button.className = 'flex items-center justify-between w-48 px-4 py-3 text-black bg-white rounded-lg hover:bg-gray-50';
    button.setAttribute('data-dropdown-button', type);
    
    const label = document.createElement('span');
    label.textContent = dropdownConfig[type].label;
    
    button.appendChild(label);
    
    button.innerHTML += `
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    `;
    container.appendChild(button);
    
    return container;
}

function createDropdownContent(items, type) {
    const dropdown = document.createElement('div');
    dropdown.className = 'absolute left-0 z-10 hidden w-64 mt-2 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto';
    dropdown.setAttribute('data-dropdown', type);

    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    const searchContainer = document.createElement('div');
    searchContainer.className = 'sticky top-0 bg-white p-2 border-b';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = `Rechercher un ${dropdownConfig[type].placeholder}...`;
    searchInput.className = 'w-full px-3 py-2 text-sm border rounded';

    searchContainer.appendChild(searchInput);
    dropdown.appendChild(searchContainer);

    const optionsList = document.createElement('ul');
    optionsList.className = 'py-2';
    optionsList.setAttribute('data-options-list', type);

    const createOptions = (itemsToDisplay) => {
        optionsList.innerHTML = '';

        itemsToDisplay.forEach(item => {
            const li = document.createElement('li');
            li.className = 'px-4 py-2 text-sm text-gray-700 hover:bg-yellow cursor-pointer capitalize';
            li.textContent = item;
            li.setAttribute('data-value', item);

            li.addEventListener('click', () => {
                handleTagSelection(type, item);
                dropdown.classList.add('hidden');
            });

            optionsList.appendChild(li);
        });
    };

    createOptions(items);

    dropdown.appendChild(optionsList);

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const options = optionsList.querySelectorAll('li');

        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    });

    return dropdown;
}

export function updateDropdownOptions(type, items) {
    const optionsList = document.querySelector(`[data-options-list="${type}"]`);

    if (!optionsList) {
        return;
    }

    optionsList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'px-4 py-2 text-sm text-gray-700 hover:bg-yellow cursor-pointer capitalize';
        li.textContent = item;
        li.setAttribute('data-value', item);

        li.addEventListener('click', () => {
            handleTagSelection(type, item);
            const dropdown = optionsList.closest('[data-dropdown]');
            if (dropdown) {
                dropdown.classList.add('hidden');
            }
        });

        optionsList.appendChild(li);
    });
}


export function updateAllDropdowns(recipes) {
    const options = extractOptionsFromRecipes(recipes);

    updateDropdownOptions('ingredients', options.ingredients);
    updateDropdownOptions('appliances', options.appliances);
    updateDropdownOptions('ustensils', options.ustensils);
}

export function clearDropdownFilters() {
    clearAllFilters();
    renderSelectedTags();
}


export function createDropdown(type, items) {
    const container = createDropdownButton(type);
    const dropdownContent = createDropdownContent(items, type);
    const button = container.querySelector('[data-dropdown-button]');
    
    container.appendChild(dropdownContent);

    button.addEventListener('click', (e) => {
        e.stopPropagation();

        document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
            if (dropdown !== dropdownContent) {
                dropdown.classList.add('hidden');
            }
        });

        dropdownContent.classList.toggle('hidden');
    });

    return container;
}

export function initializeDropdowns(recipes) {
    const options = extractOptionsFromRecipes(recipes);
    const dropdownsContainer = document.querySelector('.flex.gap-4.mb-8');
    
    if (!dropdownsContainer) {
        console.error('Container des dropdowns non trouvé');
        return;
    }
    // TODO: Auto Discover
    const dropdownTypes = ['ingredients', 'appliances', 'ustensils'];
    const recipeCounter = dropdownsContainer.querySelector('#recipe-counter');
    
    dropdownTypes.forEach(type => {
        const items = options[type];
        const dropdown = createDropdown(type, items);
        dropdownsContainer.insertBefore(dropdown, recipeCounter);
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
    });
}
