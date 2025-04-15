const { query } = require('../config/db');

const Equipment = {
  async create(userId) {
    const result = await query(
      `INSERT INTO user_equipment 
       (user_id) 
       VALUES ($1) 
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  async getByUserId(userId) {
    const result = await query(
      `SELECT 
        main_weapon_id, 
        second_weapon_id, 
        helmet_id, 
        armor_id, 
        boot_id, 
        ring_id, 
        necklace_id, 
        mount_id, 
        pet_id
       FROM user_equipment 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async update(userId, updates) {
    const validFields = [
      'main_weapon_id', 'second_weapon_id', 'helmet_id', 
      'armor_id', 'boot_id', 'ring_id', 
      'necklace_id', 'mount_id', 'pet_id'
    ];
    
    // Filter hanya field yang valid
    const filteredUpdates = {};
    validFields.forEach(field => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    // Bangun query dinamis
    const setClause = Object.keys(filteredUpdates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');

    const values = [userId, ...Object.values(filteredUpdates)];

    const result = await query(
      `UPDATE user_equipment 
       SET ${setClause} 
       WHERE user_id = $1 
       RETURNING *`,
      values
    );

    return result.rows[0];
  }
};

module.exports = Equipment;