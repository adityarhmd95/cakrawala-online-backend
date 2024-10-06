const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Fungsi untuk meng-hash password dan update di database
async function hashAndSavePassword(username, plainPassword) {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        
        // Update password di database dengan hash
        const result = await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, username]);
        
        if (result.rowCount === 1) {
            console.log(`Password for user ${username} has been updated.`);
        } else {
            console.log(`User ${username} not found.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

// Jalankan fungsi untuk user "Bojek" dan "Aditya"
hashAndSavePassword('Bojek', 'password123');
hashAndSavePassword('Aditya', 'password456');
