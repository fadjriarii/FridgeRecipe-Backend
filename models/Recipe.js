const db = require('../config/db');

const Recipe = {
    // Fungsi untuk mencari resep berdasarkan bahan yang dimasukkan
    searchByIngredients: (ingredients, callback) => {
        // Membuat query untuk pencarian full-text
        const query = `
            SELECT id, title, ingredients, directions, link, source
            FROM recipes
            WHERE MATCH(NER) AGAINST (? IN BOOLEAN MODE)
            LIMIT 5;
        `;

        // Melakukan pencarian dengan parameter bahan yang dimasukkan
        db.query(query, [ingredients], callback);
    },
    getById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT id, title, ingredients, directions FROM recipes WHERE id = ?';

            db.query(query, [id], (err, results) => {
                if (err) {
                    return reject(err);
                }

                // Jika tidak ada hasil, kembalikan null
                if (results.length === 0) {
                    return resolve(null);
                }

                // Kembalikan data resep pertama
                resolve(results[0]);
            });
        });
    },
};

module.exports = Recipe;
