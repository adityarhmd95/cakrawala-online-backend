const { query } = require('../config/db');

const GameData = {
  async create(userId) {
    const result = await query(
      `INSERT INTO user_game_data 
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
        last_map, 
        pos_x, 
        pos_y, 
        gold
       FROM user_game_data 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async update(userId, updates) {
    const validFields = ['last_map', 'pos_x', 'pos_y', 'gold'];
    
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
      `UPDATE user_game_data 
       SET ${setClause} 
       WHERE user_id = $1 
       RETURNING *`,
      values
    );

    return result.rows[0];
  },

  async updateGold(userId, amount) {
    await query('BEGIN');

    try {
      const result = await query(
        `UPDATE user_game_data 
         SET gold = gold + $2 
         WHERE user_id = $1 
         RETURNING *`,
        [userId, amount]
      );

      await query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }
};

module.exports = GameData;