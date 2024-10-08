// index.js
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const playerSkillsRoutes = require('./routes/playerSkills');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Ping API endpoint for testing connection
app.get('/ping', (req, res) => {
    return res.status(200).json({ message: 'Pong' });
});

// Use auth routes
app.use('/api/auth', authRoutes);

// Use player skills routes
app.use('/api/skill', playerSkillsRoutes);

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
