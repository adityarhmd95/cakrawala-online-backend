// /routes/wardrobe.js
const express = require('express');
const pool = require('../db/database');

const router = express.Router();

// Get wardrobe by player_id
router.get('/:playerId', async (req, res) => {
    const { playerId } = req.params;
    const client_id = req.headers['client_id'];

    try {
        // Query to get wardrobe items based on player_id
        const result = await pool.query(`
            SELECT skin_type, skin_id
            FROM wardrobe
            WHERE player_id = $1
        `, [playerId]);

        // Check if wardrobe exists for the player
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No wardrobe items found for the player'
            });
        }

        // Initialize response structure with empty arrays for each skin type
        const wardrobe = {
            player_hair: [],
            player_body: [],
            player_outfit: []
        };

        // Group the wardrobe items by skin_type
        result.rows.forEach(item => {
            if (item.skin_type === 'hair') {
                wardrobe.player_hair.push( item.skin_id );
            } else if (item.skin_type === 'body') {
                wardrobe.player_body.push( item.skin_id );
            } else if (item.skin_type === 'outfit') {
                wardrobe.player_outfit.push( item.skin_id );
            }
        });

        // Return the grouped wardrobe items
        return res.status(200).json({
            message: 'Wardrobe retrieved successfully',
            client_id: client_id,
            player_id: playerId,
            data: wardrobe
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;