const GameData = require('../models/gameDataModel');

const gameDataController = {
  async getGameData(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;

      const gameData = await GameData.getByUserId(userId);
      
      if (!gameData) {
        return res.status(404).json({
          status: 'error',
          message: 'Game data not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        data: gameData,
        client_id: clientId
      });

    } catch (error) {
      console.error('Get game data error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateGameData(req, res) {
    try {
      const { userId } = req.user;
      const updates = req.body;
      const clientId = req.headers['client_id'] || null;

      // Validasi minimal
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid game data',
          client_id: clientId
        });
      }

      // Validasi tambahan
      if (updates.pos_x !== undefined && typeof updates.pos_x !== 'number') {
        return res.status(400).json({
          status: 'error',
          message: 'pos_x must be a number',
          client_id: clientId
        });
      }

      if (updates.pos_y !== undefined && typeof updates.pos_y !== 'number') {
        return res.status(400).json({
          status: 'error',
          message: 'pos_y must be a number',
          client_id: clientId
        });
      }

      if (updates.gold !== undefined && (typeof updates.gold !== 'number' || updates.gold < 0)) {
        return res.status(400).json({
          status: 'error',
          message: 'gold must be a positive number',
          client_id: clientId
        });
      }

      const updatedGameData = await GameData.update(userId, updates);
      
      if (!updatedGameData) {
        return res.status(404).json({
          status: 'error',
          message: 'Game data not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        message: 'Game data updated successfully',
        data: updatedGameData,
        client_id: clientId
      });

    } catch (error) {
      console.error('Update game data error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateGold(req, res) {
    try {
      const { userId } = req.user;
      const { amount } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (typeof amount !== 'number') {
        return res.status(400).json({
          status: 'error',
          message: 'Amount must be a number',
          client_id: clientId
        });
      }

      const updatedData = await GameData.updateGold(userId, amount);
      
      res.json({
        status: 'success',
        message: 'Gold updated successfully',
        data: {
          new_gold: updatedData.gold
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Update gold error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = gameDataController;