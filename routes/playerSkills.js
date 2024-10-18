// /routes/playerSkills.js
const express = require('express');
const pool = require('../db/database');

const router = express.Router();

// Get player skills API endpoint
router.get('/:playerId', async (req, res) => {
  const {
    playerId
  } = req.params;
  const client_id = req.headers['client_id'];

  try {
    // Validate input
    if (!playerId) {
      return res.status(400).json({
        message: 'Player ID is required'
      });
    }

    // Query to get player skills
    const result = await pool.query('SELECT * FROM player_skills WHERE player_id = $1', [playerId]);

    // Check if playerSkills entry exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Player skills not found'
      });
    }

    // Return player skills
    return res.status(200).json({
      message: 'Player skills retrieved successfully',
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


router.put('/:playerId', async (req, res) => {
  const { playerId } = req.params;
  const client_id = req.headers['client_id'];
  const {
    chopping_lv,
    chopping_exp,
    mining_lv,
    mining_exp,
    foraging_lv,
    foraging_exp,
    farming_lv,
    farming_exp,
    cooking_lv,
    cooking_exp,
    blacksmith_lv,
    blacksmith_exp,
    tailor_lv,
    tailor_exp,
    crafting_lv,
    crafting_exp,
    sword_lv,
    sword_exp,
    dagger_lv,
    dagger_exp,
    axe_lv,
    axe_exp,
    hammer_lv,
    hammer_exp,
    club_lv,
    club_exp,
    heavy_armor_lv,
    heavy_armor_exp,
    medium_armor_lv,
    medium_armor_exp,
    light_armor_lv,
    light_armor_exp,
    assassin_lv,
    assassin_exp
  } = req.body;

  try {
    // Validate input
    if (!playerId) {
      return res.status(400).json({
        message: 'Player ID is required'
      });
    }

    // Make sure all data is provided
    const missingFields = [];
    if (chopping_lv === undefined || chopping_exp === undefined) missingFields.push('chopping');
    if (mining_lv === undefined || mining_exp === undefined) missingFields.push('mining');
    if (foraging_lv === undefined || foraging_exp === undefined) missingFields.push('foraging');
    if (farming_lv === undefined || farming_exp === undefined) missingFields.push('farming');
    if (cooking_lv === undefined || cooking_exp === undefined) missingFields.push('cooking');
    if (blacksmith_lv === undefined || blacksmith_exp === undefined) missingFields.push('blacksmith');
    if (tailor_lv === undefined || tailor_exp === undefined) missingFields.push('tailor');
    if (crafting_lv === undefined || crafting_exp === undefined) missingFields.push('crafting');
    if (sword_lv === undefined || sword_exp === undefined) missingFields.push('sword');
    if (dagger_lv === undefined || dagger_exp === undefined) missingFields.push('dagger');
    if (axe_lv === undefined || axe_exp === undefined) missingFields.push('axe');
    if (hammer_lv === undefined || hammer_exp === undefined) missingFields.push('hammer');
    if (club_lv === undefined || club_exp === undefined) missingFields.push('club');
    if (heavy_armor_lv === undefined || heavy_armor_exp === undefined) missingFields.push('heavy_armor');
    if (medium_armor_lv === undefined || medium_armor_exp === undefined) missingFields.push('medium_armor');
    if (light_armor_lv === undefined || light_armor_exp === undefined) missingFields.push('light_armor');
    if (assassin_lv === undefined || assassin_exp === undefined) missingFields.push('assassin');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing fields for: ${missingFields.join(', ')}`
      });
    }

    // Update all player skills in the database
    const query = `
          UPDATE player_skills SET 
              chopping_lv = $1, chopping_exp = $2,
              mining_lv = $3, mining_exp = $4,
              foraging_lv = $5, foraging_exp = $6,
              farming_lv = $7, farming_exp = $8,
              cooking_lv = $9, cooking_exp = $10,
              blacksmith_lv = $11, blacksmith_exp = $12,
              tailor_lv = $13, tailor_exp = $14,
              crafting_lv = $15, crafting_exp = $16,
              sword_lv = $17, sword_exp = $18,
              dagger_lv = $19, dagger_exp = $20,
              axe_lv = $21, axe_exp = $22,
              hammer_lv = $23, hammer_exp = $24,
              club_lv = $25, club_exp = $26,
              heavy_armor_lv = $27, heavy_armor_exp = $28,
              medium_armor_lv = $29, medium_armor_exp = $30,
              light_armor_lv = $31, light_armor_exp = $32,
              assassin_lv = $33, assassin_exp = $34
          WHERE player_id = $35
      `;

    const values = [
      chopping_lv, chopping_exp, mining_lv, mining_exp, foraging_lv, foraging_exp, farming_lv, farming_exp,
      cooking_lv, cooking_exp, blacksmith_lv, blacksmith_exp, tailor_lv, tailor_exp,
      crafting_lv, crafting_exp, sword_lv, sword_exp, dagger_lv, dagger_exp, axe_lv, axe_exp,
      hammer_lv, hammer_exp, club_lv, club_exp, heavy_armor_lv, heavy_armor_exp,
      medium_armor_lv, medium_armor_exp, light_armor_lv, light_armor_exp, assassin_lv, assassin_exp, playerId
    ];

    // Execute the query
    await pool.query(query, values);

    // Return success response
    return res.status(200).json({
      message: 'Player skills updated successfully',
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