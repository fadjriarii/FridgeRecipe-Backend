const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

console.log('Attempting to connect to the database...');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message, err.stack);
        return;
    }   
    console.log('Connected to the database.');
});

module.exports = db;
