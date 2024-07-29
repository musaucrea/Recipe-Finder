// Function to fetch recipes from the API
async function fetchRecipes(ingredient) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&apiKey=fe9ca7a69b77460ea4256a9609677b08`);
        const data = await response.json();

        // Check if the data returned is an array
        if (Array.isArray(data)) {
            displayRecipes(data);
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Failed to fetch recipes. Please try again later.');
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    const recipeContainer = document.getElementById('recipeContainer');
    recipeContainer.innerHTML = '';

    // Ensure recipes is an array before using forEach
    if (Array.isArray(recipes)) {
        recipes.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.innerHTML = `
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}" style="width: 100px; height: auto;">
                <button onclick="saveRecipe('${recipe.id}')">Save Recipe</button>
                <button onclick="shareRecipe('${recipe.id}')">Share Recipe</button>
            `;
            recipeContainer.appendChild(recipeElement);
        });
    } else {
        recipeContainer.innerHTML = '<p>No recipes found.</p>';
    }
}

// Function to save a recipe
function saveRecipe(recipeId) {
    // Fetch recipe details from the API
    fetchRecipeDetails(recipeId)
        .then(recipe => {
            let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
            savedRecipes.push(recipe);
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            alert('Recipe saved!');
        })
        .catch(error => {
            console.error('Error saving recipe:', error);
            alert('Failed to save recipe.');
        });
}

// Function to share a recipe
function shareRecipe(recipeId) {
    // Fetch recipe details from the API
    fetchRecipeDetails(recipeId)
        .then(recipe => {
            const shareText = `Check out this recipe: ${recipe.title}\n\nIngredients:\n${recipe.extendedIngredients.map(ing => ing.original).join('\n')}\n\nInstructions:\n${recipe.instructions}`;
            if (navigator.share) {
                navigator.share({
                    title: recipe.title,
                    text: shareText
                }).then(() => {
                    console.log('Recipe shared successfully');
                }).catch(error => {
                    console.error('Error sharing recipe:', error);
                });
            } else {
                alert('Sharing not supported in this browser. Copy the following text to share:\n\n' + shareText);
            }
        })
        .catch(error => {
            console.error('Error sharing recipe:', error);
            alert('Failed to share recipe.');
        });
}

// Function to fetch recipe details by ID from the API
async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=fe9ca7a69b77460ea4256a9609677b08`);
        const recipe = await response.json();
        return recipe;
    } catch (error) {
        throw new Error('Failed to fetch recipe details');
    }
}

// Example usage
document.getElementById('searchButton').addEventListener('click', () => {
    const ingredient = document.getElementById('ingredientInput').value;
    fetchRecipes(ingredient);
});

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Example call to fetch recipes on page load (you can modify this as needed)
    fetchRecipes('chicken');
});
