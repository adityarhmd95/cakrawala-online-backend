const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Currency = require('../models/currencyModel');
const UserStats = require('../models/userStatsModel');
const GameData = require('../models/gameDataModel');
const Equipment = require('../models/equipmentModel');
const Skills = require('../models/skillsModel');
const Inventory = require('../models/inventoryModel');
const Cosmetics = require('../models/cosmeticsModel');

const authController = {
  async register(req, res) {
    try {
      const { username, password, email } = req.body;
      const clientId = req.headers['client_id'] || null;

      // Validasi input
      if (!username || !password || !email) {
        return res.status(400).json({
          status: 'error',
          message: 'Username, password, and email are required',
          client_id: clientId
        });
      }

      // Cek apakah username atau email sudah ada
      const existingUser = await User.findByUsername(username) || await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          message: 'Username or email already exists',
          client_id: clientId
        });
      }

      // Buat user baru
      const newUser = await User.create({ username, password, email });

      // Auto-create default currency
      await Currency.create(newUser.user_id, 'cakrawala_coin', 0);

      // Auto-create default stats
      await UserStats.create(newUser.user_id);

      // Auto-create default game data
      await GameData.create(newUser.user_id);

      // Auto-create default equipment
      await Equipment.create(newUser.user_id);

      // Auto-create default skills
      await Skills.create(newUser.user_id);

      // Auto-create default inventory
      await Inventory.create(newUser.user_id);

      // Auto-create default cosmetics
      await Cosmetics.createDefault(newUser.user_id);

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.user_id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Response sukses
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
            created_at: newUser.created_at
          },
          token
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const clientId = req.headers['client_id'] || null;

      // Validasi input
      if (!username || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Username and password are required',
          client_id: clientId
        });
      }

      // Verifikasi credentials
      const user = await User.verifyCredentials(username, password);
      
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid username or password',
          client_id: clientId
        });
      }

      // Cek jika user dibanned
      if (user.is_banned) {
        const message = user.banned_until 
          ? `Account is banned until ${user.banned_until}`
          : 'Account is permanently banned';
        
        return res.status(403).json({
          status: 'error',
          message,
          client_id: clientId
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.user_id, 
          username: user.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Response sukses
      res.json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
            created_at: user.created_at
          },
          token
        },
        client_id: clientId
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = authController;