// /routes/playerSkills.js
const express = require('express');
const pool = require('../db/database');

const router = express.Router();

// Get player skills API endpoint
router.get('/:playerId', async (req, res) => {
    const { playerId } = req.params;

    try {
        // Validate input
        if (!playerId) {
            return res.status(400).json({ message: 'Player ID is required' });
        }

        // Query to get player skills
        const result = await pool.query('SELECT * FROM player_skills WHERE player_id = $1', [playerId]);

        // Check if playerSkills entry exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Player skills not found' });
        }

        // Return player skills
        return res.status(200).json({
            message: 'Player skills retrieved successfully',
            skills: result.rows[0] // Return the first row since player_id is the primary key
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Skill API endpoint
router.post('/', async (req, res) => {
    const { playerId, skillType, expGained } = req.body;

    try {
        // Validate input
        if (!playerId || !skillType || !expGained) {
            return res.status(400).json({ message: 'Player ID, skill type, and EXP gained are required' });
        }

        // Mapping skill types to database fields
        const skillMap = {
            "chopping": { levelField: "chop_lv", expField: "chop_exp" },
            "mining": { levelField: "mining_lv", expField: "mining_exp" },
            "gathering": { levelField: "gathering_lv", expField: "gathering_exp" },
            "sword": { levelField: "sword_lv", expField: "sword_exp" },
            "dagger": { levelField: "dagger_lv", expField: "dagger_exp" },
            "axe": { levelField: "axe_lv", expField: "axe_exp" },
            "hammer": { levelField: "hammer_lv", expField: "hammer_exp" },
            "club": { levelField: "club_lv", expField: "club_exp" },
            "heavy armor": { levelField: "heavy_armor_lv", expField: "heavy_armor_exp" },
            "medium armor": { levelField: "medium_armor_lv", expField: "medium_armor_exp" },
            "light armor": { levelField: "light_armor_lv", expField: "light_armor_exp" },
            "repairing": { levelField: "repairing_lv", expField: "repairing_exp" },
            "healing": { levelField: "healing_lv", expField: "healing_exp" },
            "assassin": { levelField: "assassin_lv", expField: "assassin_exp" }
        };

        // Check if skill type is valid
        if (!skillMap[skillType]) {
            return res.status(400).json({ message: 'Invalid skill type' });
        }

        // Update EXP in database
        const { levelField, expField } = skillMap[skillType];
        const result = await pool.query(
            `UPDATE player_skills
            SET ${expField} = ${expField} + $1
            WHERE player_id = $2
            RETURNING ${levelField}, ${expField}`,
            [expGained, playerId]
        );

        // Check if playerSkills entry exists
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Player skills not found' });
        }

        // Retrieve updated level and EXP
        const updatedSkill = result.rows[0];

        // Return success response
        return res.status(200).json({
            message: `${skillType.charAt(0).toUpperCase() + skillType.slice(1)} skill updated successfully`,
            skill: {
                level: updatedSkill[levelField],
                exp: updatedSkill[expField]
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;