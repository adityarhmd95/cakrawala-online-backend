const Inventory = require('../models/inventoryModel');

const inventoryController = {
  async getInventory(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;

      const inventory = await Inventory.getByUserId(userId);
      
      if (!inventory) {
        return res.status(404).json({
          status: 'error',
          message: 'Inventory not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        data: inventory,
        client_id: clientId
      });

    } catch (error) {
      console.error('Get inventory error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateInventory(req, res) {
    try {
      const { userId } = req.user;
      const { updates } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid inventory data',
          client_id: clientId
        });
      }

      const updatedInventory = await Inventory.updateInventory(userId, updates);
      
      res.json({
        status: 'success',
        message: 'Inventory updated successfully',
        data: updatedInventory,
        client_id: clientId
      });

    } catch (error) {
      console.error('Update inventory error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateSlot(req, res) {
    try {
      const { userId } = req.user;
      const { slot_id } = req.params;
      const { item_data } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!slot_id || !item_data) {
        return res.status(400).json({
          status: 'error',
          message: 'slot_id and item_data are required',
          client_id: clientId
        });
      }

      const updatedInventory = await Inventory.updateSlot(userId, slot_id, item_data);
      
      res.json({
        status: 'success',
        message: 'Slot updated successfully',
        data: {
          slot: slot_id,
          item: updatedInventory.items[slot_id],
          updated_at: updatedInventory.updated_at
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Update slot error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = inventoryController;