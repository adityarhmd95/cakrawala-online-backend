// /routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/database');

const router = express.Router();


router.post('/hello', async (req, res) => {
    return "Hello World"
});


// Register API endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const client_id = req.headers['client_id'];

    console.log("ini jalan")

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

        // Initialize default inventory with the structure
        await pool.query(
            'INSERT INTO player_inventory (player_id) VALUES ($1)',
            [newPlayer.rows[0].player_id]
        );

        // Initialize default wardrobe (for example, default body, hair, and outfit)
        const defaultWardrobe = [
            { skin_type: 'body', skin_id: 'body_01' },
            { skin_type: 'body', skin_id: 'body_02' },
            { skin_type: 'hair', skin_id: 'hair_01' },
            { skin_type: 'hair', skin_id: 'hair_02' },
            { skin_type: 'outfit', skin_id: 'outfit_01' },
            { skin_type: 'outfit', skin_id: 'outfit_02' }
        ];

        for (const item of defaultWardrobe) {
            await pool.query(
                'INSERT INTO wardrobe (player_id, skin_type, skin_id) VALUES ($1, $2, $3)',
                [newPlayer.rows[0].player_id, item.skin_type, item.skin_id]
            );
        }

        return res.status(201).json({
            message: 'User registered successfully',
            client_id: client_id,
            data: {
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

// Login API endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const client_id = req.headers['client_id'];

    try {
        // Check if user exists by username, ignoring case sensitivity
        const userQuery = await pool.query(`
            SELECT * FROM users 
            WHERE LOWER(username) = LOWER($1)
        `, [username]);

        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = userQuery.rows[0];

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.hash_password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Get the player's player_id associated with this user
        const playerQuery = await pool.query(
            'SELECT player_id FROM players WHERE user_id = $1',
            [user.user_id]
        );

        if (playerQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Player data not found for this user' });
        }

        const player_id = playerQuery.rows[0].player_id;

        // If login is successful, return user details (excluding password)
        return res.status(200).json({
            message: 'Login successful',
            client_id: client_id,
            data: {
                user_id: user.user_id,
                player_id: player_id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
