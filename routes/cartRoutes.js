const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token (from cookies)
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Read from HttpOnly cookie
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, username }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

// Get Cart
router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM cart_items WHERE user_id = ?', [req.user.id]);
        
        // Map DB columns to frontend expected format if needed (currently 1:1)
        const items = rows.map(row => ({
            id: row.product_id, // Frontend uses 'id' for product ID string
            name: row.name,
            price: Number(row.price),
            quantity: row.quantity
        }));
        
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Sync/Save Cart Item (Add or Update)
// Frontend sends single item to add/update, or we could support bulk sync. 
// For simplicity, let's implement "Add/Update Item"
router.post('/', verifyToken, async (req, res) => {
    try {
        const { id, name, price, quantity } = req.body; // id is product_id

        // Check if item exists for user
        const [existing] = await db.execute(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
            [req.user.id, id]
        );

        if (existing.length > 0) {
            // Update quantity
            await db.execute(
                'UPDATE cart_items SET quantity = ?, price = ? WHERE user_id = ? AND product_id = ?',
                [quantity, price, req.user.id, id]
            );
        } else {
            // Insert
            await db.execute(
                'INSERT INTO cart_items (user_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)',
                [req.user.id, id, name, price, quantity]
            );
        }

        res.json({ message: 'Cart updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove Item
router.delete('/:productId', verifyToken, async (req, res) => {
    try {
        await db.execute(
            'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
            [req.user.id, req.params.productId]
        );
        res.json({ message: 'Item removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Clear Cart
router.delete('/', verifyToken, async (req, res) => {
    try {
        await db.execute('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
