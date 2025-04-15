const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create({ username, password, email }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username, email, created_at',
      [username, hashedPassword, email]
    );
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async verifyCredentials(username, password) {
    const user = await this.findByUsername(username);
    if (!user) return null;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    // Jangan kembalikan password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async findByUserId(userId) {
    const result = await query(
      'SELECT user_id, username, email FROM users WHERE user_id = $1',
      [userId]
    );
    return result.rows[0];
  }

};

module.exports = User;