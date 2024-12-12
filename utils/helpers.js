const JSONParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return [];
    }
};

module.exports = { JSONParse };
