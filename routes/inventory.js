// /routes/inventory.js
const express = require('express');
const pool = require('../db/database'); // Pastikan ini menunjuk ke konfigurasi database yang benar

const router = express.Router();

// Get inventory by player_id
router.get('/:playerId', async (req, res) => {
    const { playerId } = req.params;
    const client_id = req.headers['client_id'];

    try {
        // Query to get the player's inventory
        const result = await pool.query(
            'SELECT inventory FROM player_inventory WHERE player_id = $1',
            [playerId]
        );

        // Check if inventory exists for the player
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Inventory not found for this player' });
        }

        // Return the player's inventory
        return res.status(200).json({
            message: 'Inventory retrieved successfully',
            client_id: client_id,
            inventory: result.rows[0].inventory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// Update inventory by player_id
router.put('/:playerId', async (req, res) => {
    const { playerId } = req.params;
    const client_id = req.headers['client_id'];
    const { inventory } = req.body;

    try {
        // Validate input
        if (!inventory) {
            return res.status(400).json({ message: 'Inventory data is required' });
        }

        // Update inventory in the database
        const result = await pool.query(
            'UPDATE player_inventory SET inventory = $1 WHERE player_id = $2 RETURNING *',
            [inventory, playerId]
        );

        // Check if the player exists and inventory was updated
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Player not found or inventory could not be updated' });
        }

        console.log(result.rows[0].player_id);

        // Return success response
        return res.status(200).json({
            message: 'Inventory updated successfully',
            client_id: client_id,
            player_id: result.rows[0].player_id,
            inventory: result.rows[0].inventory
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
