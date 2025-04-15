const Equipment = require('../models/equipmentModel');

const equipmentController = {
  async getEquipment(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;

      const equipment = await Equipment.getByUserId(userId);
      
      if (!equipment) {
        return res.status(404).json({
          status: 'error',
          message: 'Equipment data not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        data: equipment,
        client_id: clientId
      });

    } catch (error) {
      console.error('Get equipment error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateEquipment(req, res) {
    try {
      const { userId } = req.user;
      const updates = req.body;
      const clientId = req.headers['client_id'] || null;

      // Validasi minimal
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid equipment data',
          client_id: clientId
        });
      }

      const updatedEquipment = await Equipment.update(userId, updates);
      
      if (!updatedEquipment) {
        return res.status(404).json({
          status: 'error',
          message: 'Equipment data not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        message: 'Equipment updated successfully',
        data: updatedEquipment,
        client_id: clientId
      });

    } catch (error) {
      console.error('Update equipment error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = equipmentController;