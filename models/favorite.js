const db = require('../config/db');

const Favorite = {
    add: (userId, recipeId, callback) => {
        const sql = 'INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)';
        db.query(sql, [userId, recipeId], callback);
    },
    getByUserId: (userId, callback) => {
        const sql = `
            SELECT recipes.id, recipes.title, recipes.ingredients, recipes.directions, recipes.link, recipes.source
            FROM favorites
            JOIN recipes ON favorites.recipe_id = recipes.id
            WHERE favorites.user_id = ?
        `;
        db.query(sql, [userId], callback);
    },
    getByUserIdAndRecipeId: (userId, recipeId, callback) => {
        const sql = `
            SELECT recipes.id, recipes.title, recipes.ingredients, recipes.directions, recipes.link, recipes.source
            FROM favorites
            JOIN recipes ON favorites.recipe_id = recipes.id
            WHERE favorites.user_id = ? AND favorites.recipe_id = ?
        `;
        db.query(sql, [userId, recipeId], callback);
    },
    remove: (userId, recipeId, callback) => {
        const sql = 'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?';
        db.query(sql, [userId, recipeId], callback);
    },
};

module.exports = Favorite;
