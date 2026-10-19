const express = require('express');
const cors = require('cors');
const path = require('path'); // <-- 1. Imported path module
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- 2. SERVE FRONTEND STATIC FILES ---
// This serves everything inside a folder named 'public' on your main URL
app.use(express.static(path.join(__dirname, 'public')));

const route = '/products';

// Root Route (Note: If you have an index.html inside a 'public' folder, 
// Render will show index.html instead of this JSON message on the homepage)
app.get('/api-info', (req, res) => {
    res.json({ message: "Welcome to the Local Tech Product API with SQLite!" });
});

// GET: Retrieve all products
app.get(route, (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// GET: Retrieve single product by ID
app.get(`${route}/:id`, (req, res) => {
    db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(row);
    });
});

// POST: Add a new product
app.post(route, (req, res) => {
    const { product_name, brand, category, price, stock_quantity, description } = req.body;

    if (!product_name || !brand || !category || price === undefined || stock_quantity === undefined) {
        return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const query = `INSERT INTO products (product_name, brand, category, price, stock_quantity, description) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [product_name, brand, category, price, stock_quantity, description], function(err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: "Product added successfully!",
            id: this.lastID,
            product_name,
            brand,
            category,
            price,
            stock_quantity,
            description
        });
    });
});

// --- PUT: Edit/Update an existing product by ID ---
app.put(`${route}/:id`, (req, res) => {
    const productId = req.params.id;
    const { product_name, brand, category, price, stock_quantity, description } = req.body;

    if (!product_name || !brand || !category || price === undefined || stock_quantity === undefined) {
        return res.status(400).json({ error: "Please fill in all required fields for updating." });
    }

    const query = `UPDATE products SET product_name = ?, brand = ?, category = ?, price = ?, stock_quantity = ?, description = ? WHERE id = ?`;
    
    db.run(query, [product_name, brand, category, price, stock_quantity, description, productId], function(err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ 
            message: "Product updated successfully!",
            id: productId,
            product_name,
            brand,
            category,
            price,
            stock_quantity,
            description
        });
    });
});

// --- DELETE: Remove a product by ID ---
app.delete(`${route}/:id`, (req, res) => {
    const productId = req.params.id;

    const query = `DELETE FROM products WHERE id = ?`;
    
    db.run(query, [productId], function(err) {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully!", id: productId });
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});