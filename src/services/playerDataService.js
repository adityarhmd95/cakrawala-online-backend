const { query } = require('../config/db');
const User = require('../models/userModel');
const UserStats = require('../models/userStatsModel');
const Equipment = require('../models/equipmentModel');
const Currency = require('../models/currencyModel');
const GameData = require('../models/gameDataModel');
const Inventory = require('../models/inventoryModel');
const Skills = require('../models/skillsModel');
const Cosmetics = require('../models/cosmeticsModel');

const playerDataService = {
  async getAllPlayerData(userId) {
    try {
      // Jalankan semua query secara paralel
      const [
        user,
        stats,
        equipment,
        currencies,
        gameData,
        inventory,
        skills,
        cosmetics
      ] = await Promise.all([
        User.findByUserId(userId),
        UserStats.getByUserId(userId),
        Equipment.getByUserId(userId),
        Currency.getUserCurrencies(userId),
        GameData.getByUserId(userId),
        Inventory.getByUserId(userId),
        Skills.getByUserId(userId),
        Cosmetics.getAll(userId)
      ]);

      return {
        user,
        stats,
        equipment,
        currencies,
        gameData,
        inventory,
        skills,
        cosmetics
      };
    } catch (error) {
      console.error('Error fetching player data:', error);
      throw error;
    }
  },

  async updateAllPlayerData(userId, data){
    await query('BEGIN'); // Mulai transaction
  
    try {
      // Update stats
      if (data.stats) {
        await UserStats.update(userId, data.stats);
      }
  
      // Update equipment
      if (data.equipment) {
        await Equipment.update(userId, data.equipment);
      }
  
      // Update currencies (contoh: cakrawala_coin)
      if (data.currencies) {
        for (const currency of data.currencies) {
          await Currency.updateAmount(
            userId, 
            currency.currency_type, 
            currency.amount
          );
        }
      }
  
      // Update game data
      if (data.gameData) {
        await GameData.update(userId, data.gameData);
      }
  
      // Update inventory
      if (data.inventory) {
        await Inventory.updateInventory(userId, data.inventory);
      }
  
      // Update skills
      if (data.skills) {
        await Skills.bulkUpdateSkills(userId, data.skills);
      }
  
      // Update cosmetics (khusus yang active)
      if (data.cosmetics) {
        const activeCosmetics = data.cosmetics.filter(c => c.is_active);
        for (const cosmetic of activeCosmetics) {
          await Cosmetics.setActiveCosmetic(
            userId, 
            cosmetic.skin_type, 
            cosmetic.skin_id
          );
        }
      }
  
      await query('COMMIT');
      return true;
    } catch (error) {
      await query('ROLLBACK');
      console.error('Update all player data error:', error);
      throw error;
    }
  }
};

module.exports = playerDataService;