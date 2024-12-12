const Favorite = require('../models/favorite');
const getImages = require('../utils/image');
const { JSONParse } = require('../utils/helpers');

const addBulletToList = (list) => {
    return list.map((item) => `- ${item}`);
};

// Menambahkan Resep ke Favorit
const addFavorite = (req, res) => {
    const userId = req.userId;
    const { recipeId } = req.body;

    Favorite.add(userId, recipeId, (err) => {
        if (err) return res.status(500).json({ message: 'Error adding to favorites' });
        res.status(201).json({ message: 'Recipe added to favorites' });
    });
};

// Mendapatkan Daftar Favorit Berdasarkan User ID
const getFavorites = async (req, res) => {
    const userId = req.userId;

    Favorite.getByUserId(userId, async (err, results) => {
        if (err) {
            console.error('Error retrieving favorites:', err);
            return res.status(500).json({ message: 'Error retrieving favorites' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No favorites found' });
        }

        try {
            const processedRecipes = results.map((recipe) => ({
                ...recipe,
                ingredients: addBulletToList(JSONParse(recipe.ingredients)).join('<br>'),
                directions: addBulletToList(JSONParse(recipe.directions)).join('<br>'),
            }));

            // Menambahkan gambar untuk setiap resep favorit
            const favoritesWithMedia = await Promise.all(
                processedRecipes.map(async (recipe) => {
                    const imageUrl = await getImages(recipe.title);
                    if (imageUrl && imageUrl !== 'https://via.placeholder.com/150?text=Gambar+tidak+tersedia') {
                        return { 
                            ...recipe,
                            image: imageUrl, // Valid image
                        };
                    }
                    return null; // Tidak mengembalikan resep jika gambar tidak valid
                })
            );

            // Filter resep yang memiliki gambar valid
            const validFavorites = favoritesWithMedia.filter(recipe => recipe !== null);

            if (validFavorites.length === 0) {
                return res.status(404).json({ message: 'No favorites with valid images found' });
            }

            res.status(200).json({ favorites: validFavorites });
        } catch (error) {
            console.error('Error processing favorites:', error);
            res.status(500).json({ message: 'Error processing favorites' });
        }
    });
};

// Menampilkan Data Favorit Berdasarkan ID Recipe
const getFavoriteByRecipeId = async (req, res) => {
    const userId = req.userId;
    const { recipeId } = req.params;

    // Ambil data favorit berdasarkan userId dan recipeId
    Favorite.getByUserIdAndRecipeId(userId, recipeId, async (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving favorite by recipe ID' });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Favorite not found for the given recipe ID' });
        }

        const recipe = results[0];

        const processedRecipe = {
            ...recipe,
            ingredients: JSONParse(recipe.ingredients).map((step) => `- ${step}`).join('<br>'),
            directions: JSONParse(recipe.directions).map((step) => `- ${step}`).join('<br>'),
        };

        const imageUrl = await getImages(recipe.title);
        if (imageUrl && imageUrl !== 'https://via.placeholder.com/150?text=Gambar+tidak+tersedia') {
            processedRecipe.image = imageUrl;
            return res.status(200).json(processedRecipe); // Mengirimkan resep dengan gambar valid
        } else {
            return res.status(404).json({ message: 'No valid image found for this recipe' });
        }
    });
};

// Menghapus Resep dari Favorit
const removeFavorite = (req, res) => {
    const userId = req.userId;
    const { recipeId } = req.params;

    console.log('Removing favorite with recipeId:', recipeId);
    
    Favorite.remove(userId, recipeId, (err) => {
        if (err) return res.status(500).json({ message: 'Error removing favorite' });
        res.status(200).json({ message: 'Recipe removed from favorites' });
    });
};

module.exports = { addFavorite, getFavorites, getFavoriteByRecipeId, removeFavorite };