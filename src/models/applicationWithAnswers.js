const pool = require('../config/database');

class ApplicationWithAnswers {
  static async getByUser(userId) {
    try {
      const [results] = await pool.execute(
        'CALL get_applications_with_final_answers(?)',
        [userId]
      );
      return results[0] || [];
    } catch (error) {
      console.error('Error in getByUser:', error);
      throw error;
    }
  }
}

module.exports = ApplicationWithAnswers;