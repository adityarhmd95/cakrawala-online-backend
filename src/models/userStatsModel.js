const { query } = require('../config/db');

const UserStats = {
  async create(userId) {
    const result = await query(
      `INSERT INTO user_stats 
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
        hp, mp, atk, def, crit_chance, 
        move_speed, weight, weapon_type 
        FROM user_stats 
      WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async update(userId, stats) {
    const validFields = [
      'hp', 'mp', 'atk', 'def', 
      'crit_chance', 'move_speed', 
      'weight', 'weapon_type'
    ];

    // Filter hanya field yang valid
    const updates = {};
    validFields.forEach(field => {
      if (stats[field] !== undefined) {
        updates[field] = stats[field];
      }
    });

    // Bangun query dinamis
    const setClause = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');

    const values = [userId, ...Object.values(updates)];

    const result = await query(
      `UPDATE user_stats 
       SET ${setClause} 
       WHERE user_id = $1 
       RETURNING *`,
      values
    );

    return result.rows[0];
  }
};

module.exports = UserStats;