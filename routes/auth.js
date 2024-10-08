// /routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/database');

const router = express.Router();

// Register API endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (username, hash_password, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );

        // Create a new player entry
        const newPlayer = await pool.query(
            'INSERT INTO players (user_id) VALUES ($1) RETURNING *',
            [newUser.rows[0].user_id]
        );

        // Initialize player skills with default values
        await pool.query(
            'INSERT INTO player_skills (player_id) VALUES ($1)',
            [newPlayer.rows[0].player_id]
        );

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                user_id: newUser.rows[0].user_id,
                username: newUser.rows[0].username,
                email: newUser.rows[0].email,
                player_id: newPlayer.rows[0].player_id,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
