const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

const route = '/products';

// 1. GET: Retrieve all products
app.get(route, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Database error" });
    }
});

// 2. GET: Retrieve one product by ID
app.get(`${route}/:id`, async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM products WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Database error" });
    }
});

// 3. POST: Add a product
app.post(route, async (req, res) => {
    try {
        const {
            product_name, brand, category,
            price, stock_quantity, description
        } = req.body;

        if (
            !product_name || !brand || !category ||
            price == null || stock_quantity == null ||
            !Number.isFinite(Number(price)) || Number(price) < 0 ||
            !Number.isInteger(Number(stock_quantity)) ||
            Number(stock_quantity) < 0
        ) {
            return res.status(400).json({
                error: "Invalid product details"
            });
        }

        const [result] = await db.query(
            `INSERT INTO products 
            (product_name, brand, category, price, stock_quantity, description) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [product_name, brand, category, price, stock_quantity, description]
        );

        res.status(201).json({
            id: result.insertId,
            product_name,
            brand,
            category,
            price,
            stock_quantity,
            description
        });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Database error" });
    }
});

// 4. PUT: Update a product
app.put(`${route}/:id`, async (req, res) => {
    try {
        const {
            product_name, brand, category,
            price, stock_quantity, description
        } = req.body;

        const [result] = await db.query(
            `UPDATE products SET product_name = ?, brand = ?, category = ?, price = ?, stock_quantity = ?, description = ? WHERE id = ?`,
            [product_name, brand, category, price, stock_quantity, description, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Database error" });
    }
});

// 5. DELETE: Delete a product
app.delete(`${route}/:id`, async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM products WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ error: "Database error" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});