require('dotenv').config();
const axios = require('axios');

const apiKeys = {
    primary: process.env.SPOONACULAR_API_KEY
};

// Function to fetch the image from Spoonacular API
const getImageFromSpoonacular = async (recipeTitle) => {
    try {
        const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(recipeTitle)}&apiKey=${apiKeys.primary}&number=1`;
        const response = await axios.get(url);

        if (response.status === 200 && response.data.results.length > 0) {
            const recipe = response.data.results[0];
            return recipe.image;
        } else {
            console.warn('No image found in Spoonacular response');
            return "https://via.placeholder.com/150?text=No+Image+Found";
        }
    } catch (error) {
        console.error("Error fetching image from Spoonacular:", error.message || error);
        return "https://via.placeholder.com/150?text=Error+Fetching+Image"; // Default fallback image
    }
};

// Main image scraping function that only uses the primary API (Spoonacular)
const getImage = async (recipeTitle) => {
    // Attempt to get the image from Spoonacular
    const primaryImage = await getImageFromSpoonacular(recipeTitle);

    // Return the image or fallback image if there was an issue
    return primaryImage;
};

module.exports = getImage;
