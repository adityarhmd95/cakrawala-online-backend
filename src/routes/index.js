const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();
const authController = require('../controllers/authController');
const currencyController = require('../controllers/currencyController');
const transactionController = require('../controllers/transactionController');
const rewardController = require('../controllers/rewardController');
const userStatsController = require('../controllers/userStatsController');
const gameDataController = require('../controllers/gameDataController');
const equipmentController = require('../controllers/equipmentController');
const skillsController = require('../controllers/skillsController');
const inventoryController = require('../controllers/inventoryController');
const cosmeticsController = require('../controllers/cosmeticsController');
const playerDataController = require('../controllers/playerDataController');

// Middleware untuk menangkap client_id
router.use((req, res, next) => {
  req.clientId = req.headers['client_id'] || null;
  next();
});

// Contoh route
router.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'API is working',
    client_id: req.clientId
  });
});

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Currency routes
router.get('/currencies/:currency_type', auth, currencyController.getCurrency);

// Transaction routes
router.post('/coins/topup', auth, transactionController.topup);
router.post('/coins/use', auth, transactionController.useCoin);
router.get('/coins/history', auth, transactionController.getHistory);

// Reward routes
router.post('/admin/rewards/:user_id', auth, rewardController.giveReward);

// User stats routes
router.get('/stats', auth, userStatsController.getStats);
router.put('/stats', auth, userStatsController.updateStats);

// Game data routes
router.get('/game-data', auth, gameDataController.getGameData);
router.put('/game-data', auth, gameDataController.updateGameData);
router.post('/game-data/gold', auth, gameDataController.updateGold);

// Equipment routes
router.get('/equipment', auth, equipmentController.getEquipment);
router.put('/equipment', auth, equipmentController.updateEquipment);

// Skills routes
router.get('/skills', auth, skillsController.getSkills);
router.post('/skills/exp', auth, skillsController.addSkillExp);
router.put('/skills', auth, skillsController.updateSkills);

// Inventory routes
router.get('/inventory', auth, inventoryController.getInventory);
router.put('/inventory', auth, inventoryController.updateInventory);
router.put('/inventory/slots/:slot_id', auth, inventoryController.updateSlot);

// Cosmetics routes
router.get('/cosmetics', auth, cosmeticsController.getAllCosmetics);
router.post('/cosmetics', auth, cosmeticsController.addCosmetic);
router.post('/cosmetics/active', auth, cosmeticsController.setActiveCosmetic);

// Player data routes
router.get('/player-data', auth, playerDataController.getAllData);
router.put('/player-data', auth, playerDataController.updateAllData);

module.exports = router;