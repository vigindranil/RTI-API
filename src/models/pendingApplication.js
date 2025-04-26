const pool = require('../config/database');

class PendingApplication {
  static async getAll() {
    try {
      const [results] = await pool.execute('CALL GetPendingApplicationInfo()');
      return results[0] || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }
}

module.exports = PendingApplication;