const pool = require('../config/database');

class PendingApplication {
  static async getAll(userId) {
    try {
      const [results] = await pool.execute('CALL GetPendingApplicationInfo(?)', [userId]);
      return results[0] || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  }
}

module.exports = PendingApplication;