const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// This creates a local database file named 'database.sqlite' inside your backend folder
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening SQLite database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create products table automatically if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    stock_quantity INTEGER NOT NULL,
    description TEXT
)`);

// Export a promise-friendly wrapper or use sqlite methods directly
module.exports = db;