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
            return res.status(400).json({
                message: 'Player ID is required'
            });
        }

        // Query to get player details
        const result = await pool.query(`
            SELECT * FROM players WHERE player_id = $1
        `, [playerId]);

        // Check if player exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Player not found'
            });
        }

        // Return player details
        return res.status(200).json({
            message: 'Player details retrieved successfully',
            client_id: client_id,
            data: result.rows[0] // Return the first row since player_id is the primary key
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

// Update player API endpoint
router.put('/:playerId', async (req, res) => {
    const { playerId } = req.params;
    const client_id = req.headers['client_id'];
    const {
        hp,
        mp,
        atk,
        def,
        crit_chance,
        move_speed,
        level,
        current_exp,
        total_exp,
        weapon_type,
        main_weapon_id,
        second_weapon_id,
        helmet_id,
        armor_id,
        trouser_id,
        boot_id,
        player_body,
        player_hair,
        player_outfit,
        weight,
        last_map,
        pos_x,
        pos_y
    } = req.body;

    try {
        // Validate input
        if (!playerId) {
            return res.status(400).json({
                message: 'Player ID is required'
            });
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
        if (level !== undefined) {
            fields.push(`level = $${index++}`);
            values.push(level);
        }
        if (current_exp !== undefined) {
            fields.push(`current_exp = $${index++}`);
            values.push(current_exp);
        }
        if (total_exp !== undefined) {
            fields.push(`total_exp = $${index++}`);
            values.push(total_exp);
        }
        if (main_weapon_id !== undefined) {
            fields.push(`main_weapon_id = $${index++}`);
            values.push(main_weapon_id);
        }
        if (weapon_type !== undefined) {
            fields.push(`weapon_type = $${index++}`);
            values.push(weapon_type);
        }
        if (second_weapon_id !== undefined) {
            fields.push(`second_weapon_id = $${index++}`);
            values.push(second_weapon_id);
        }
        if (helmet_id !== undefined) {
            fields.push(`helmet_id = $${index++}`);
            values.push(helmet_id);
        }
        if (armor_id !== undefined) {
            fields.push(`armor_id = $${index++}`);
            values.push(armor_id);
        }
        if (trouser_id !== undefined) {
            fields.push(`trouser_id = $${index++}`);
            values.push(trouser_id);
        }
        if (boot_id !== undefined) {
            fields.push(`boot_id = $${index++}`);
            values.push(boot_id);
        }
        if (player_body !== undefined) {
            fields.push(`player_body = $${index++}`);
            values.push(player_body);
        }
        if (player_hair !== undefined) {
            fields.push(`player_hair = $${index++}`);
            values.push(player_hair);
        }
        if (player_outfit !== undefined) {
            fields.push(`player_outfit = $${index++}`);
            values.push(player_outfit);
        }
        if (weight !== undefined) {
            fields.push(`weight = $${index++}`);
            values.push(weight);
        }
        if (last_map !== undefined) {
            fields.push(`last_map = $${index++}`);
            values.push(last_map);
        }
        if (pos_x !== undefined) {
            fields.push(`pos_x = $${index++}`);
            values.push(pos_x);
        }
        if (pos_y !== undefined) {
            fields.push(`pos_y = $${index++}`);
            values.push(pos_y);
        }

        // If no fields to update
        if (fields.length === 0) {
            return res.status(400).json({
                message: 'No fields to update'
            });
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
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;