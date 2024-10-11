// /routes/player.js
const express = require('express');
const pool = require('../db/database');

const router = express.Router();

// Get player details API endpoint
router.get('/:playerId', async (req, res) => {
    const { playerId } = req.params;
    const client_id = req.headers['client_id'];

    try {
        // Validate input
        if (!playerId) {
            return res.status(400).json({ message: 'Player ID is required' });
        }

        // Query to get player details
        const result = await pool.query('SELECT * FROM players WHERE player_id = $1', [playerId]);

        // Check if player exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Player not found' });
        }

        // Return player details
        return res.status(200).json({
            message: 'Player details retrieved successfully',
            client_id: client_id,
            data: result.rows[0] // Return the first row since player_id is the primary key
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Update player API endpoint
router.put('/:playerId', async (req, res) => {
  const { playerId } = req.params;
  const { hp, mp, atk, def, crit_chance, move_speed, atk_speed } = req.body;
  const client_id = req.headers['client_id'];

  try {
      // Validate input
      if (!playerId) {
          return res.status(400).json({ message: 'Player ID is required' });
      }

      // Build the update query
      const fields = [];
      const values = [];
      let index = 1;

      if (hp !== undefined) {
          fields.push(`hp = $${index++}`);
          values.push(hp);
      }
      if (mp !== undefined) {
          fields.push(`mp = $${index++}`);
          values.push(mp);
      }
      if (atk !== undefined) {
          fields.push(`atk = $${index++}`);
          values.push(atk);
      }
      if (def !== undefined) {
          fields.push(`def = $${index++}`);
          values.push(def);
      }
      if (crit_chance !== undefined) {
          fields.push(`crit_chance = $${index++}`);
          values.push(crit_chance);
      }
      if (move_speed !== undefined) {
          fields.push(`move_speed = $${index++}`);
          values.push(move_speed);
      }
      if (atk_speed !== undefined) {
          fields.push(`atk_speed = $${index++}`);
          values.push(atk_speed);
      }

      // If no fields to update
      if (fields.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
      }

      // Add playerId to the end of the values
      values.push(playerId);

      // Update player in the database
      const query = `UPDATE players SET ${fields.join(', ')} WHERE player_id = $${index}`;
      await pool.query(query, values);

      // Return success response
      return res.status(200).json({
          message: 'Player updated successfully',
          client_id: client_id,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
