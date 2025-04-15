const Skills = require('../models/skillsModel');

const skillsController = {
  async getSkills(req, res) {
    try {
      const { userId } = req.user;
      const clientId = req.headers['client_id'] || null;

      const skills = await Skills.getByUserId(userId);
      
      if (!skills) {
        return res.status(404).json({
          status: 'error',
          message: 'Skills data not found',
          client_id: clientId
        });
      }

      res.json({
        status: 'success',
        data: skills,
        client_id: clientId
      });

    } catch (error) {
      console.error('Get skills error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async addSkillExp(req, res) {
    try {
      const { userId } = req.user;
      const { skill_name, exp_gained } = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!skill_name || !exp_gained || typeof exp_gained !== 'number' || exp_gained <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'skill_name and positive exp_gained are required',
          client_id: clientId
        });
      }

      const result = await Skills.updateSkill(userId, skill_name, exp_gained);
      
      res.json({
        status: 'success',
        message: result.leveled_up ? 'Skill leveled up!' : 'Skill exp added',
        data: result,
        client_id: clientId
      });

    } catch (error) {
      console.error('Add skill exp error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  },

  async updateSkills(req, res) {
    try {
      const { userId } = req.user;
      const updates = req.body;
      const clientId = req.headers['client_id'] || null;

      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid skills data',
          client_id: clientId
        });
      }

      const updatedSkills = await Skills.bulkUpdateSkills(userId, updates);
      
      res.json({
        status: 'success',
        message: 'Skills updated successfully',
        data: updatedSkills,
        client_id: clientId
      });

    } catch (error) {
      console.error('Update skills error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Internal server error',
        client_id: req.headers['client_id'] || null
      });
    }
  }
};

module.exports = skillsController;