const express = require('express');
const router = express.Router();
const { searchRecipes, getRecipeById } = require('../controllers/recipeController');

// Endpoint untuk mencari resep berdasarkan bahan
router.get('/search', searchRecipes);
router.get('/:id', getRecipeById);

module.exports = router;
