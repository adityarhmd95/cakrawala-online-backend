const { query } = require('../config/db');

const Skills = {
  async create(userId) {
    const result = await query(
      `INSERT INTO user_skills 
       (user_id) 
       VALUES ($1) 
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  },

  async getByUserId(userId) {
    const result = await query(
      `SELECT 
        logging_lv, logging_exp,
        mining_lv, mining_exp,
        foraging_lv, foraging_exp,
        farming_lv, farming_exp,
        fishing_lv, fishing_exp,
        skinning_lv, skinning_exp,
        alchemy_lv, alchemy_exp,
        cooking_lv, cooking_exp,
        sawmilling_lv, sawmilling_exp,
        carpenter_lv, carpenter_exp,
        smelting_lv, smelting_exp,
        smithing_lv, smithing_exp,
        leatherworking_lv, leatherworking_exp,
        leathersmithing_lv, leathersmithing_exp,
        weaving_lv, weaving_exp,
        tailoring_lv, tailoring_exp,
        assassin_lv, assassin_exp,
        sword_lv, sword_exp,
        dagger_lv, dagger_exp,
        club_lv, club_exp,
        spear_lv, spear_exp,
        staff_lv, staff_exp,
        wand_lv, wand_exp,
        bow_lv, bow_exp,
        heavy_armor_lv, heavy_armor_exp,
        medium_armor_lv, medium_armor_exp,
        light_armor_lv, light_armor_exp
       FROM user_skills 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async updateSkill(userId, skillName, expGained) {
    // Validasi nama skill
    const validSkills = [
      'logging', 'mining', 'foraging', 'farming', 'fishing', 'skinning',
      'alchemy', 'cooking', 'sawmilling', 'carpenter', 'smelting', 'smithing',
      'leatherworking', 'leathersmithing', 'weaving', 'tailoring',
      'assassin', 'sword', 'dagger', 'club', 'spear', 'staff', 'wand', 'bow'
    ];

    if (!validSkills.includes(skillName)) {
      throw new Error('Invalid skill name');
    }

    // Hitung level up jika perlu
    const currentData = await this.getByUserId(userId);
    const currentLv = currentData[`${skillName}_lv`];
    const currentExp = currentData[`${skillName}_exp`];
    
    let newExp = currentExp + expGained;
    let newLv = currentLv;
    
    // Simple level up formula (1000 exp per level)
    const expNeeded = currentLv * 1000;
    if (newExp >= expNeeded) {
      newLv += 1;
      newExp = newExp - expNeeded;
    }

    await query('BEGIN');

    try {
      const result = await query(
        `UPDATE user_skills 
         SET ${skillName}_lv = $2, 
             ${skillName}_exp = $3 
         WHERE user_id = $1 
         RETURNING *`,
        [userId, newLv, newExp]
      );

      await query('COMMIT');
      return {
        skill: skillName,
        new_level: newLv,
        new_exp: newExp,
        previous_level: currentLv,
        previous_exp: currentExp,
        leveled_up: newLv > currentLv
      };
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  async bulkUpdateSkills(userId, updates) {
    const validSkills = [
      'logging', 'mining', 'foraging', 'farming', 'fishing', 'skinning',
      'alchemy', 'cooking', 'sawmilling', 'carpenter', 'smelting', 'smithing',
      'leatherworking', 'leathersmithing', 'weaving', 'tailoring',
      'assassin', 'sword', 'dagger', 'club', 'spear', 'staff', 'wand', 'bow'
    ];

    // Filter valid updates
    const filteredUpdates = {};
    for (const [skill, value] of Object.entries(updates)) {
      const skillName = skill.replace(/_lv$/, '').replace(/_exp$/, '');
      if (validSkills.includes(skillName)) {
        filteredUpdates[skill] = value;
      }
    }

    // dynamic query generation
    const setClause = Object.keys(filteredUpdates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');

    const values = [userId, ...Object.values(filteredUpdates)];

    const result = await query(
      `UPDATE user_skills 
       SET ${setClause} 
       WHERE user_id = $1 
       RETURNING *`,
      values
    );

    return result.rows[0];
  }
};

module.exports = Skills;