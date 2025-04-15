const { query } = require('../config/db');

const Currency = {
  async create(userId, currencyType, initialAmount = 0) {
    const result = await query(
      `INSERT INTO user_currencies 
       (user_id, currency_type, amount) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, currencyType, initialAmount]
    );
    return result.rows[0];
  },

  async getByUserAndType(userId, currencyType) {
    const result = await query(
      `SELECT * FROM user_currencies 
       WHERE user_id = $1 AND currency_type = $2`,
      [userId, currencyType]
    );
    return result.rows[0];
  },

  async getUserCurrencies(userId) {
    const result = await query(
      `SELECT currency_type, amount, last_updated 
       FROM user_currencies 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  async updateAmount(userId, currencyType, newAmount) {
    const result = await query(
      `UPDATE user_currencies 
       SET amount = $3, last_updated = NOW() 
       WHERE user_id = $1 AND currency_type = $2 
       RETURNING *`,
      [userId, currencyType, newAmount]
    );
    return result.rows[0];
  },

  async updateAmountWithTransaction(userId, currencyType, amount, transactionType, referenceId = null) {
    // Mulai transaction
    await query('BEGIN');
  
    try {
      // Update currency amount
      const updateResult = await query(
        `UPDATE user_currencies 
         SET amount = amount + $3, last_updated = NOW() 
         WHERE user_id = $1 AND currency_type = $2 
         RETURNING *`,
        [userId, currencyType, amount]
      );
  
      if (!updateResult.rows[0]) {
        throw new Error('Currency not found');
      }
  
      // Buat transaction log
      await query(
        `INSERT INTO coin_transactions 
         (user_id, amount, transaction_type, reference_id) 
         VALUES ($1, $2, $3, $4)`,
        [userId, amount, transactionType, referenceId]
      );
  
      // Commit transaction
      await query('COMMIT');
  
      return updateResult.rows[0];
    } catch (error) {
      // Rollback jika ada error
      await query('ROLLBACK');
      throw error;
    }
  }  
};

module.exports = Currency;