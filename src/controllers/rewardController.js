const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

const rewardController = {
  async giveReward(req, res) {
    try {
      const { user_id } = req.params;
      const { amount, reward_type, reference_id } = req.body;
      const clientId = req.headers['client_id'] || null;

      // Validasi input
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount must be a positive number',
          client_id: clientId
        });
      }

      // Cek user exists
      const user = await User.findByUserId(user_id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          client_id: clientId
        });
      }

      // Berikan reward
      const result = await Transaction.giveReward(
        user_id,
        amount,
        reward_type || 'reward',
        reference_id
      );

      res.json({
        status: 'success',
        message: 'Reward given successfully',
        data: {
          user_id: user_id,
          amount_given: amount,
          new_balance: result.currency.amount,
          transaction_id: result.transaction.transaction_id,
          reward_type: reward_type || 'reward'
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Give reward error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = rewardController;