const { query } = require('../config/db');

const defaultCosmetics = [
  { skin_type: 'body', skin_id: 'body_01' },
  { skin_type: 'hair', skin_id: 'hair_01' },
  { skin_type: 'outfit', skin_id: 'outfit_01' }
];

const Cosmetics = {
  async createDefault(userId) {
    await query('BEGIN');
    try {
      for (const cosmetic of defaultCosmetics) {
        await query(
          `INSERT INTO user_cosmetics 
           (user_id, skin_type, skin_id, is_active) 
           VALUES ($1, $2, $3, $4)`,
          [userId, cosmetic.skin_type, cosmetic.skin_id, cosmetic.skin_type !== 'body'] // Aktifkan hanya body_01
        );
      }
      await query('COMMIT');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  async getAll(userId) {
    const result = await query(
      `SELECT 
        skin_type, 
        skin_id, 
        is_active
       FROM user_cosmetics 
       WHERE user_id = $1 
       ORDER BY skin_type, acquired_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async addCosmetic(userId, skinType, skinId) {
    // Cek apakah sudah ada
    const existing = await query(
      `SELECT 1 FROM user_cosmetics 
       WHERE user_id = $1 AND skin_type = $2 AND skin_id = $3`,
      [userId, skinType, skinId]
    );

    if (existing.rows.length > 0) {
      throw new Error('Cosmetic already owned');
    }

    const result = await query(
      `INSERT INTO user_cosmetics 
       (user_id, skin_type, skin_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, skinType, skinId]
    );

    return result.rows[0];
  },

  async setActiveCosmetic(userId, skinType, skinId) {
    await query('BEGIN');
    try {
      // Nonaktifkan semua cosmetic dengan type yang sama
      await query(
        `UPDATE user_cosmetics 
         SET is_active = FALSE 
         WHERE user_id = $1 AND skin_type = $2`,
        [userId, skinType]
      );

      // Aktifkan cosmetic yang dipilih
      const result = await query(
        `UPDATE user_cosmetics 
         SET is_active = TRUE 
         WHERE user_id = $1 AND skin_type = $2 AND skin_id = $3 
         RETURNING *`,
        [userId, skinType, skinId]
      );

      if (result.rows.length === 0) {
        throw new Error('Cosmetic not found');
      }

      await query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }
};

module.exports = Cosmetics;