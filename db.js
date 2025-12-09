const mysql = require('mysql2/promise');

// CONFIGURATION
// Replace '...' with your actual pipeline/production connection string if available via ENV
// or hardcode it here if you prefer to commit it directly (be careful with secrets in public repos).
const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:7M(N.%2B%25v%26)uBQY*@34.13.32.99:3306/fish_chips_db';

const pool = mysql.createPool({
    uri: DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

async function initDB() {
    try {
        const connection = await pool.getConnection();
        console.log(`Connected to MySQL Database`);
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id VARCHAR(50) NOT NULL,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // console.log('Database tables initialized.');
        connection.release();
    } catch (err) {
        console.error('Database initialization failed:', err.message);
        console.error('Please check your DATABASE_URL in db.js');
    }
}

initDB();

module.exports = pool;
