const Cosmetics = require('../models/cosmeticsModel');

const cosmeticsController = {
  async getAllCosmetics(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;

      const cosmetics = await Cosmetics.getAll(userId);
      
      res.json({
        status: 'success',
        data: cosmetics,
        client_id: clientId
      });

    } catch (error) {
      console.error('Get cosmetics error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async addCosmetic(req, res) {
    try {
      const { userId } = req.user;
      const { skin_type, skin_id } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!skin_type || !skin_id) {
        return res.status(400).json({
          status: 'error',
          message: 'skin_type and skin_id are required',
          client_id: clientId
        });
      }

      if (!['body', 'hair', 'outfit'].includes(skin_type)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid skin_type. Must be body, hair, or outfit',
          client_id: clientId
        });
      }

      const newCosmetic = await Cosmetics.addCosmetic(userId, skin_type, skin_id);
      
      res.status(201).json({
        status: 'success',
        message: 'Cosmetic added successfully',
        data: newCosmetic,
        client_id: clientId
      });

    } catch (error) {
      console.error('Add cosmetic error:', error);
      const status = error.message === 'Cosmetic already owned' ? 400 : 500;
      res.status(status).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async setActiveCosmetic(req, res) {
    try {
      const { userId } = req.user;
      const { skin_type, skin_id } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!skin_type || !skin_id) {
        return res.status(400).json({
          status: 'error',
          message: 'skin_type and skin_id are required',
          client_id: clientId
        });
      }

      if (!['body', 'hair', 'outfit'].includes(skin_type)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid skin_type. Must be body, hair, or outfit',
          client_id: clientId
        });
      }

      const updatedCosmetic = await Cosmetics.setActiveCosmetic(userId, skin_type, skin_id);
      
      res.json({
        status: 'success',
        message: 'Cosmetic activated successfully',
        data: updatedCosmetic,
        client_id: clientId
      });

    } catch (error) {
      console.error('Set active cosmetic error:', error);
      const status = error.message === 'Cosmetic not found' ? 404 : 500;
      res.status(status).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = cosmeticsController;