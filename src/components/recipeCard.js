
export function createRecipeCard(recipe) {
    const article = document.createElement('article');
    article.className = 'overflow-hidden bg-white rounded-lg shadow-md max-w-[402px]';

    const ingredientsHTML = recipe.ingredients.map(item => {
        const quantity = item.quantity || '';
        const unit = item.unit || '';
        const quantityDisplay = quantity ? `<span class="text-lightgrey font-manrope">${quantity}${unit}</span>` : '';

        return `
            <div>
                <span class="font-medium">${item.ingredient}</span>
                ${quantityDisplay ? '<br>' + quantityDisplay : ''}
            </div>
        `;
    }).join('');

    const description = recipe.description.length > 180
        ? recipe.description.substring(0, 180) + '...'
        : recipe.description;

    article.innerHTML = `
        <div class="relative">
            <img src="./assets/recipes/new/${recipe.image}" alt="${recipe.name}" class="object-cover w-full h-64">
            <div class="absolute top-4 right-4 bg-yellow text-black px-3 py-1 rounded-full text-sm font-thin">
                ${recipe.time}min
            </div>
        </div>
        <div class="p-9 pb-16">
            <h2 class="mb-4 text-xl font-bold text-gray-900">${recipe.name}</h2>
            <div class="mb-10">
                <h3 class="mb-4 text-xs font-medium tracking-wider text-lightgrey uppercase">Recette</h3>
                <p class="text-sm text-gray-700 leading-relaxed font-manrope">
                    ${description}
                </p>
            </div>
            <div>
                <h3 class="mb-4 text-xs font-medium tracking-wider text-lightgrey uppercase">Ingrédients</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    ${ingredientsHTML}
                </div>
            </div>
        </div>
    `;

    return article;
}

export function displayRecipes(recipes) {
    const recipesContainer = document.querySelector('#recipes-container');

    if (!recipesContainer) {
        console.error('Le conteneur des recettes n\'a pas été trouvé');
        return;
    }

    recipesContainer.innerHTML = '';

    if (recipes.length === 0) {
        recipesContainer.innerHTML = `
            <p class="col-span-3 text-center text-lg text-gray-500 mt-12">
                Aucune recette ne correspond à votre recherche
            </p>
        `;
        updateRecipeCounter(0);
        return;
    }

    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        recipesContainer.appendChild(card);
    });

    updateRecipeCounter(recipes.length);
}


export function updateRecipeCounter(count) {
    const recipeCounter = document.querySelector('#recipe-counter');
    if (recipeCounter) {
        recipeCounter.textContent = `${count} recette${count > 1 ? 's' : ''}`;
    }
}
