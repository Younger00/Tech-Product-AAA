const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            brand TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            stock_quantity INTEGER NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (!err) {
                // Check if the products table is empty, and seed your products if it is!
                db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
                    if (!err && row.count === 0) {
                        const seedProducts = [
                            ['Laptop', 'Lenovo', 'Computers', 8500.00, 10, 'Student laptop'],
                            ['Smartphone', 'Samsung', 'Phones', 4200.00, 15, 'Android phone'],
                            ['Headphones', 'Sony', 'Audio', 650.00, 20, 'Wireless headphones'],
                            ['Keyboard', 'Logitech', 'Accessories', 350.00, 12, 'USB keyboard'],
                            ['Mouse', 'HP', 'Accessories', 180.00, 25, 'Wireless mouse'],
                            ['Monitor', 'Dell', 'Displays', 2100.00, 8, 'Full HD monitor'],
                            ['Tablet', 'Samsung', 'Tablets', 3200.00, 7, 'Portable tablet'],
                            ['Speaker', 'JBL', 'Audio', 950.00, 9, 'Bluetooth speaker'],
                            ['Webcam', 'Logitech', 'Accessories', 500.00, 11, 'USB webcam'],
                            ['Printer', 'Canon', 'Printers', 1800.00, 6, 'Office printer']
                        ];

                        const query = `INSERT INTO products (product_name, brand, category, price, stock_quantity, description) VALUES (?, ?, ?, ?, ?, ?)`;
                        
                        seedProducts.forEach(p => {
                            db.run(query, p, (err) => {
                                if (err) console.error("Error seeding product:", err.message);
                            });
                        });
                        console.log("Default products seeded successfully!");
                    }
                });
            }
        });
    }
});

module.exports = db;