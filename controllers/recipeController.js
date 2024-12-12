const Recipe = require('../models/Recipe');
const getImages = require('../utils/image');

const searchRecipes = (req, res) => {
    const { ingredients } = req.query; // Mengambil bahan dari query parameter

    if (!ingredients) {
        return res.status(400).json({ message: 'Ingredients are required' });
    }

    // Memanggil model untuk mencari resep berdasarkan bahan
    Recipe.searchByIngredients(ingredients, async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving recipes' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No recipes found' });
        }

        // Mendapatkan gambar untuk setiap resep
        const processedRecipes = await Promise.all(
            results.map(async (recipe) => {
                const imageUrl = await getImages(recipe.title); // Mendapatkan gambar dari API
                
                // Jika gambar valid, kembalikan resep. Jika tidak, jangan kembalikan resep tersebut.
                if (imageUrl && imageUrl !== 'https://via.placeholder.com/150?text=No+Image+Found') {
                    return {
                        id: recipe.id,
                        title: recipe.title,
                        ingredients: JSON.parse(recipe.ingredients), // Parse ingredients
                        directions: JSON.parse(recipe.directions),   // Parse directions
                        link: recipe.link,
                        source: recipe.source,
                        image: imageUrl, // Gambar yang valid
                    };
                }
                return null; // Jika gambar tidak valid, jangan kembalikan resep
            })
        );

        // Filter resep yang gambar valid (tidak null)
        const validRecipes = processedRecipes.filter(recipe => recipe !== null);

        if (validRecipes.length === 0) {
            return res.status(404).json({ message: 'No recipes with valid images found' });
        }

        res.status(200).json({ recipes: validRecipes });
    });
};

const getRecipeById = async (req, res) => {
    const { id } = req.params; // Get id from URL parameter

    try {
        // Call model to get recipe by ID
        const recipe = await Recipe.getById(id);

        // If recipe not found
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Get image for the recipe
        const imageUrl = await getImages(recipe.title);

        // Prepare recipe response with image
        const recipeWithImage = {
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients), // Parse ingredients
            directions: JSON.parse(recipe.directions),   // Parse directions
            image: imageUrl && imageUrl !== 'https://via.placeholder.com/150?text=No+Image+Found' 
                ? imageUrl 
                : null
        };

        // Send recipe data to client
        res.status(200).json({ recipe: recipeWithImage });

    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ message: 'Error fetching recipe by ID' });
    }
};

module.exports = { searchRecipes, getRecipeById };