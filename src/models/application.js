const pool = require('../config/database');

class Application {
  static async getByUserAndStatus(userId, status) {
    try {
      const [results] = await pool.execute(
        'CALL GetApplicationsByUserAndStatus(?, ?)',
        [userId, status]
      );
      return results[0] || [];
    } catch (error) {
      console.error('Error in getByUserAndStatus:', error);
      throw error;
    }
  }
}

module.exports = Application;