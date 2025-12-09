const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Env fallback for port or default to 3000
const PORT = process.env.PORT || 3000;
// We don't strictly need JWT_SECRET in env if we hardcode for "pipeline" ease
// But good practice to at least check
process.env.JWT_SECRET = process.env.JWT_SECRET || 'pipeline_secret_key_12345';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Frontend Static Files
// This allows the backend to host the entire site
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.use('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving frontend from ../frontend`);
});
