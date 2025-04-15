const Currency = require('../models/currencyModel');

const currencyController = {
  async getCurrency(req, res) {
    try {
      const userId = req.user.userId; // Menggunakan userId dari middleware
      const { currency_type } = req.params;
      const clientId = req.headers['client_id'] || null;
  
      console.log('User ID from token:', userId); // Debug log
  
      const currency = await Currency.getByUserAndType(userId, currency_type);
      
      if (!currency) {
        return res.status(404).json({
          status: 'error',
          message: 'Currency not found',
          client_id: clientId
        });
      }
  
      res.json({
        status: 'success',
        data: {
          currency_type: currency.currency_type,
          amount: currency.amount,
          last_updated: currency.last_updated
        },
        client_id: clientId
      });
  
    } catch (error) {
      console.error('Get currency error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = currencyController;