const UserStats = require('../models/userStatsModel');

const userStatsController = {
  async getStats(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;

      const stats = await UserStats.getByUserId(userId);
      
      if (!stats) {
        return res.status(404).json({
          status: 'error',
          message: 'User stats not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        data: stats,
        client_id: clientId
      });

    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateStats(req, res) {
    try {
      const { userId } = req.user;
      const statsUpdates = req.body;
      const clientId = req.headers['client_id'] || null;

      // Validasi minimal
      if (!statsUpdates || typeof statsUpdates !== 'object') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid stats data',
          client_id: clientId
        });
      }

      // Validasi setiap field untuk minimal dan maksimal
      const validateStat = (field, value) => {
        const validations = {
          hp: v => v >= 0 && v <= 1000,
          mp: v => v >= 0 && v <= 500,
          atk: v => v >= 0 && v <= 100,
          def: v => v >= 0 && v <= 100,
          crit_chance: v => v >= 0 && v <= 1,
          move_speed: v => v >= 0 && v <= 500,
          weight: v => v >= 0 && v <= 10000,
          weapon_type: v => ['UNARMED', 'ARMED', 'DUAL_ARMED'].includes(v)
        };
      
        if (validations[field] && !validations[field](value)) {
          throw new Error(`Invalid value for ${field}`);
        }
      };
      
      // Sebelum update, tambahkan:
      Object.entries(statsUpdates).forEach(([field, value]) => {
        validateStat(field, value);
      });      

      const updatedStats = await UserStats.update(userId, statsUpdates);
      
      if (!updatedStats) {
        return res.status(404).json({
          status: 'error',
          message: 'User stats not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        message: 'Stats updated successfully',
        data: updatedStats,
        client_id: clientId
      });

    } catch (error) {
      console.error('Update stats error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = userStatsController;