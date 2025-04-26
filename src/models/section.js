const pool = require('../config/database');

class Section {
  static async getAll() {
    try {
      const [results] = await pool.execute('CALL GetSection()');
      return results[0] || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }
}

module.exports = Section;