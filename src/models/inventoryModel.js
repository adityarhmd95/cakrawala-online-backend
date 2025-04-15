const { query } = require('../config/db');

const defaultInventory = {
  Slot01: { Item: null, Stack: 0 },
  Slot02: { Item: null, Stack: 0 },
  Slot03: { Item: null, Stack: 0 },
  Slot04: { Item: null, Stack: 0 },
  Slot05: { Item: null, Stack: 0 },
  Slot06: { Item: null, Stack: 0 },
  Slot07: { Item: null, Stack: 0 },
  Slot08: { Item: null, Stack: 0 },
  Slot09: { Item: null, Stack: 0 },
  Slot10: { Item: null, Stack: 0 },
  Slot11: { Item: null, Stack: 0 },
  Slot12: { Item: null, Stack: 0 },
  Slot13: { Item: null, Stack: 0 },
  Slot14: { Item: null, Stack: 0 },
  Slot15: { Item: null, Stack: 0 },
  Slot16: { Item: null, Stack: 0 },
  Slot17: { Item: null, Stack: 0 },
  Slot18: { Item: null, Stack: 0 },
  Slot19: { Item: null, Stack: 0 },
  Slot20: { Item: null, Stack: 0 },
  Slot21: { Item: null, Stack: 0 },
  Slot22: { Item: null, Stack: 0 },
  Slot23: { Item: null, Stack: 0 },
  Slot24: { Item: null, Stack: 0 },
  Slot25: { Item: null, Stack: 0 }
};

const Inventory = {
  async create(userId) {
    const result = await query(
      `INSERT INTO user_inventory 
       (user_id, items) 
       VALUES ($1, $2) 
       RETURNING *`,
      [userId, JSON.stringify(defaultInventory)]
    );
    return result.rows[0];
  },

  async getByUserId(userId) {
    const result = await query(
      `SELECT items FROM user_inventory 
       WHERE user_id = $1`,
      [userId]
    );
    
    if (result.rows[0]) {
      return typeof result.rows[0].items === 'string' 
        ? JSON.parse(result.rows[0].items) 
        : result.rows[0].items;
    }
    return null;
  },

  async updateInventory(userId, updates) {
    // Dapatkan inventory saat ini
    const currentInventory = await this.getByUserId(userId);
    
    // Gabungkan dengan updates
    const updatedItems = {
      ...currentInventory.items,
      ...updates
    };

    await query('BEGIN');

    try {
      const result = await query(
        `UPDATE user_inventory 
         SET items = $2, updated_at = NOW() 
         WHERE user_id = $1 
         RETURNING *`,
        [userId, JSON.stringify(updatedItems)]
      );

      await query('COMMIT');
      
      // Parse items kembali ke object
      const inventory = result.rows[0];
      inventory.items = typeof inventory.items === 'string' 
        ? JSON.parse(inventory.items)
        : inventory.items;
      
      return inventory;
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  async updateSlot(userId, slotId, itemData) {
    // Validasi slotId
    if (!slotId.match(/^Slot\d{2}$/) || parseInt(slotId.replace('Slot', '')) > 25) {
      throw new Error('Invalid slot ID');
    }

    // Validasi itemData
    if (!itemData || typeof itemData !== 'object') {
      throw new Error('Invalid item data');
    }

    const update = {
      [slotId]: {
        Item: itemData.Item || null,
        Stack: itemData.Stack || 0
      }
    };

    return this.updateInventory(userId, update);
  }
};

module.exports = Inventory;