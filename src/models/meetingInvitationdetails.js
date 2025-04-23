const pool = require('../config/database');

class MeetingInvitation {
  static async getMeetingIdAndNumber() {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute('CALL GetMeetingIdAndNumber()');
      return {
        success: true,
        data: results[0]
      };
    } catch (error) {
      console.error('Error in getMeetingIdAndNumber:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = MeetingInvitation;