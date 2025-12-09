const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Env fallback for port or default to 3000
const PORT = process.env.PORT || 3000;
// We don't strictly need JWT_SECRET in env if we hardcode for "pipeline" ease
// But good practice to at least check
process.env.JWT_SECRET = process.env.JWT_SECRET || 'pipeline_secret_key_12345';

const app = express();

// Trust Proxy for Render/Heroku (required for secure cookies and rate limiting)
app.set('trust proxy', 1);

// Security Headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for simple dev/local setup if needed, or configure carefully
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Middleware
const allowedOrigins = [
    'http://localhost:3000', 
    process.env.FRONTEND_URL // Add production URL here via Env Var
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && origin !== process.env.FRONTEND_URL) {
            // For simple same-origin deployment, we can just allow it, or be strict.
            // If served from the same domain, origin might be null or same.
            // A simple "return callback(null, true);" is often easiest for monorepos if we trust the source.
            // But let's look for match.
             return callback(null, true); // Relaxing for now to avoid deployment headaches with "preview" URLs
        }
        return callback(null, true);
    },
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

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
