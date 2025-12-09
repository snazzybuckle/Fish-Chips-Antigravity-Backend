const db = require('../db');

async function migrate() {
    try {
        console.log('Adding UNIQUE constraint to username...');
        // We first try to add the constraint. If duplicates exist, this might fail, 
        // effectively telling us we have duplicates to clean up or just fails.
        // IGNORE keyword might not work for ALTER TABLE in all MySQL versions for constraints.
        // We'll try standard ALTER.
        await db.query('ALTER TABLE users ADD UNIQUE (username)');
        console.log('Successfully added UNIQUE constraint.');
    } catch (err) {
        if (err.code === 'ER_DUP_KEY' || err.code === 'ER_DUP_ENTRY') {
            console.error('Failed to add UNIQUE constraint: Duplicate usernames exist in the database.');
        } else if (err.code === 'ER_DUP_KEYNAME') {
             console.log('UNIQUE constraint already exists.');
        } else {
            console.error('Migration failed:', err.message);
        }
    } finally {
        process.exit();
    }
}

migrate();
