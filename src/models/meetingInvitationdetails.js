const pool = require('../config/database');

class MeetingInvitation {
    static async getMeetingIdAndNumber(userId) {
        const connection = await pool.getConnection();
        try {
          const [results] = await connection.execute('CALL GetMeetingIdAndNumber(?)', [userId]);
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