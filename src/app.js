// Import des recettes
import { recipes } from '../data/recipes.js';

// Fonction pour extraire les options uniques de chaque catégorie
function extractUniqueOptions() {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    recipes.forEach(recipe => {
        // Extraire les ingrédients
        recipe.ingredients.forEach(item => {
            // Normaliser le nom de l'ingrédient (première lettre en majuscule)
            const ingredientName = item.ingredient.toLowerCase();
            ingredients.add(ingredientName);
        });

        // Extraire les appareils
        if (recipe.appliance) {
            appliances.add(recipe.appliance.toLowerCase());
        }

        // Extraire les ustensiles
        recipe.ustensils.forEach(ustensil => {
            ustensils.add(ustensil.toLowerCase());
        });
    });

    // Convertir les Sets en tableaux triés
    return {
        ingredients: Array.from(ingredients).sort(),
        appliances: Array.from(appliances).sort(),
        ustensils: Array.from(ustensils).sort()
    };
}

// Fonction pour créer le contenu d'un dropdown
function createDropdownContent(items, type) {
    const dropdown = document.createElement('div');
    dropdown.className = 'absolute left-0 z-10 hidden w-64 mt-2 bg-white rounded-lg shadow-lg max-h-64 overflow-y-auto';
    dropdown.setAttribute('data-dropdown', type);

    // Empêcher la fermeture du dropdown lors du clic à l'intérieur
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Barre de recherche dans le dropdown
    const searchContainer = document.createElement('div');
    searchContainer.className = 'sticky top-0 bg-white p-2 border-b';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = `Rechercher un ${type === 'ingredients' ? 'ingrédient' : type === 'appliances' ? 'appareil' : 'ustensile'}...`;
    searchInput.className = 'w-full px-3 py-2 text-sm border rounded';

    searchContainer.appendChild(searchInput);
    dropdown.appendChild(searchContainer);

    // Liste des options
    const optionsList = document.createElement('ul');
    optionsList.className = 'py-2';

    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'px-4 py-2 text-sm text-gray-700 hover:bg-yellow cursor-pointer capitalize';
        li.textContent = item;
        li.setAttribute('data-value', item);

        // Événement de sélection
        li.addEventListener('click', () => {
            console.log(`Sélectionné: ${item} dans ${type}`);
            // TODO: Ajouter la logique de filtrage ici
            dropdown.classList.add('hidden');
        });

        optionsList.appendChild(li);
    });

    dropdown.appendChild(optionsList);

    // Recherche dans le dropdown
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

// Initialiser les dropdowns
function initializeDropdowns() {
    const options = extractUniqueOptions();

    // Sélectionner les boutons de dropdown
    const dropdownButtons = document.querySelectorAll('[data-dropdown-button]');

    dropdownButtons.forEach(button => {
        const type = button.getAttribute('data-dropdown-button');
        let items = [];

        switch(type) {
            case 'ingredients':
                items = options.ingredients;
                break;
            case 'appliances':
                items = options.appliances;
                break;
            case 'ustensils':
                items = options.ustensils;
                break;
        }

        // Créer et ajouter le contenu du dropdown
        const dropdownContent = createDropdownContent(items, type);
        button.parentElement.appendChild(dropdownContent);

        // Toggle du dropdown
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            // Fermer tous les autres dropdowns
            document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
                if (dropdown !== dropdownContent) {
                    dropdown.classList.add('hidden');
                }
            });

            // Toggle du dropdown actuel
            dropdownContent.classList.toggle('hidden');
        });
    });

    // Fermer les dropdowns en cliquant à l'extérieur
    document.addEventListener('click', () => {
        document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
    });

    console.log('Dropdowns initialisés:', {
        ingredients: options.ingredients.length,
        appliances: options.appliances.length,
        ustensils: options.ustensils.length
    });
}

// Fonction pour créer une carte de recette
function createRecipeCard(recipe) {
    const article = document.createElement('article');
    article.className = 'overflow-hidden bg-white rounded-lg shadow-md';

    // Formatage des ingrédients
    const ingredientsHTML = recipe.ingredients.map(item => {
        const quantity = item.quantity || '';
        const unit = item.unit || '';
        const quantityDisplay = quantity ? `<span class="text-gray-600">${quantity}${unit}</span>` : '';

        return `
            <div>
                <span class="font-medium">${item.ingredient}</span>
                ${quantityDisplay ? '<br>' + quantityDisplay : ''}
            </div>
        `;
    }).join('');

    // Tronquer la description si elle est trop longue
    const description = recipe.description.length > 180
        ? recipe.description.substring(0, 180) + '...'
        : recipe.description;

    article.innerHTML = `
        <div class="relative">
            <img src="./assets/recipes/new/${recipe.image}" alt="${recipe.name}" class="object-cover w-full h-64">
            <div class="absolute top-4 right-4 bg-yellow text-black px-3 py-1 rounded-full text-sm font-bold">
                ${recipe.time}min
            </div>
        </div>
        <div class="p-6">
            <h2 class="mb-4 text-xl font-bold text-gray-900">${recipe.name}</h2>
            <div class="mb-4">
                <h3 class="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Recette</h3>
                <p class="text-sm text-gray-700 leading-relaxed">
                    ${description}
                </p>
            </div>
            <div>
                <h3 class="mb-3 text-xs font-bold tracking-wider text-gray-500 uppercase">Ingrédients</h3>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    ${ingredientsHTML}
                </div>
            </div>
        </div>
    `;

    return article;
}

// Fonction pour afficher toutes les recettes
function displayRecipes(recipesToDisplay = recipes) {
    const recipesContainer = document.querySelector('#recipes-container');

    if (!recipesContainer) {
        console.error('Le conteneur des recettes n\'a pas été trouvé');
        return;
    }

    // Vider le conteneur
    recipesContainer.innerHTML = '';

    // Ajouter chaque recette
    recipesToDisplay.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipesContainer.appendChild(card);
    });

    // Mettre à jour le compteur de recettes
    const recipeCounter = document.querySelector('#recipe-counter');
    if (recipeCounter) {
        recipeCounter.textContent = `${recipesToDisplay.length} recette${recipesToDisplay.length > 1 ? 's' : ''}`;
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();
    displayRecipes();
});
