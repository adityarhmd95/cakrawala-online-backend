const Currency = require('../models/currencyModel');
const Transaction = require('../models/transactionModel');

const transactionController = {
  async topup(req, res) {
    try {
      const { userId } = req.user;
      const { amount, reference_id } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount must be a positive number',
          client_id: clientId
        });
      }

      const updatedCurrency = await Currency.updateAmountWithTransaction(
        userId,
        'cakrawala_coin',
        amount,
        'topup',
        reference_id
      );

      const newBalance = await Transaction.getBalance(userId);

      res.json({
        status: 'success',
        message: 'Topup successful',
        data: {
          new_balance: newBalance,
          transaction: {
            amount,
            type: 'topup',
            reference_id
          }
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Topup error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async useCoin(req, res) {
    try {
      const { userId } = req.user;
      const { amount, reference_id, description } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Amount must be a positive number',
          client_id: clientId
        });
      }

      const currentBalance = await Transaction.getBalance(userId);
      if (currentBalance < amount) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient coin balance',
          current_balance: currentBalance,
          client_id: clientId
        });
      }

      const updatedCurrency = await Currency.updateAmountWithTransaction(
        userId,
        'cakrawala_coin',
        -amount, // Negative amount for deduction
        description || 'usage',
        reference_id
      );

      const newBalance = await Transaction.getBalance(userId);

      res.json({
        status: 'success',
        message: 'Coin usage successful',
        data: {
          new_balance: newBalance,
          transaction: {
            amount: -amount,
            type: description || 'usage',
            reference_id
          }
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Use coin error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async getHistory(req, res) {
    try {
      const { userId } = req.user;
      const { limit } = req.query;
      const clientId = req.headers['client_id'] || null;

      const transactions = await Transaction.getByUser(userId, limit || 10);
      const balance = await Transaction.getBalance(userId);

      res.json({
        status: 'success',
        data: {
          balance,
          transactions
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = transactionController;