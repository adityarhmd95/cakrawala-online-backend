const { query } = require('../config/db');

const Transaction = {
  async create(userId, amount, transactionType, referenceId = null) {
    const result = await query(
      `INSERT INTO coin_transactions 
       (user_id, amount, transaction_type, reference_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, amount, transactionType, referenceId]
    );
    return result.rows[0];
  },

  async getByUser(userId, limit = 10) {
    const result = await query(
      `SELECT * FROM coin_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async getBalance(userId) {
    const result = await query(
      `SELECT SUM(amount) as balance 
       FROM coin_transactions 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0].balance || 0;
  },

  async giveReward(userId, amount, rewardType, referenceId = null) {
    await query('BEGIN');
  
    try {
      // Update user_currencies
      const updateResult = await query(
        `UPDATE user_currencies 
         SET amount = amount + $2, last_updated = NOW()
         WHERE user_id = $1 AND currency_type = 'cakrawala_coin'
         RETURNING *`,
        [userId, amount]
      );
  
      if (!updateResult.rows[0]) {
        throw new Error('User or currency not found');
      }
  
      // Create transaction log
      const transaction = await query(
        `INSERT INTO coin_transactions
         (user_id, amount, transaction_type, reference_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, amount, rewardType, referenceId]
      );
  
      await query('COMMIT');
  
      return {
        currency: updateResult.rows[0],
        transaction: transaction.rows[0]
      };
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  }
};

module.exports = Transaction;