const playerDataService = require('../services/playerDataService');

const playerDataController = {
  async getAllData(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;

      const playerData = await playerDataService.getAllPlayerData(userId);

      // Periksa jika ada data yang tidak ditemukan
      if (!playerData.user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        data: playerData,
        client_id: clientId
      });

    } catch (error) {
      console.error('Get all player data error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateAllData(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;
      const updateData = req.body;
  
      if (!updateData || typeof updateData !== 'object') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid update data',
          client_id: clientId
        });
      }
  
      await playerDataService.updateAllPlayerData(userId, updateData);
  
      res.json({
        status: 'success',
        message: 'All player data updated successfully',
        client_id: clientId
      });
  
    } catch (error) {
      console.error('Update all player data error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = playerDataController;