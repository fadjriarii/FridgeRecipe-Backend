const express = require('express');
const { addFavorite, getFavorites, getFavoriteByRecipeId, removeFavorite } = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/favorite', authMiddleware, addFavorite);
router.get('/favorite', authMiddleware, getFavorites);
router.get('/favorite/:recipeId', authMiddleware, getFavoriteByRecipeId);
router.delete('/favorite/:recipeId', authMiddleware, removeFavorite);

module.exports = router;
