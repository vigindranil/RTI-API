const pool = require('../config/database');

class FirstAppeal {
  constructor(appeal) {
    this.application_id = appeal.application_id;
    this.appeal_date = appeal.appeal_date;
    this.receive_date = appeal.receive_date;
    this.user_id = appeal.user_id;
    this.appeal_reason = appeal.appeal_reason;
    this.hearing_date = appeal.hearing_date;
    this.ref_no = appeal.ref_no;
    this.ref_date = appeal.ref_date;
    this.appeal_no = appeal.appeal_no;
    this.appeal_authority_id = appeal.appeal_authority_id;
    this.memo_no = appeal.memo_no;
    this.memo_date = appeal.memo_date;
  }

  // Create a new first appeal using stored procedure
  static async create(newAppeal) {
    try {
      const connection = await pool.getConnection();
      
      try {
        const [result] = await connection.query(
          'CALL sp_insert_first_appeal(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            newAppeal.application_id,
            newAppeal.appeal_date,
            newAppeal.receive_date,
            newAppeal.user_id,
            newAppeal.appeal_reason,
            newAppeal.hearing_date,
            newAppeal.ref_no,
            newAppeal.ref_date,
            newAppeal.appeal_no,
            newAppeal.appeal_authority_id,
            newAppeal.memo_no,
            newAppeal.memo_date
          ]
        );
        
        return { success: true, data: result };
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error in FirstAppeal.create:', error);
      throw error;
    }
  }

  // Get first appeal by ID
  static async findById(id) {
    try {
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query(
          'SELECT * FROM first_appeal WHERE id = ?',
          [id]
        );
        
        return rows.length ? rows[0] : null;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error in FirstAppeal.findById:', error);
      throw error;
    }
  }

  // Get first appeals by application ID
  static async findByApplicationId(applicationId) {
    try {
      const connection = await pool.getConnection();
      
      try {
        const [rows] = await connection.query(
          'SELECT * FROM first_appeal WHERE application_id = ?',
          [applicationId]
        );
        
        return rows;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error in FirstAppeal.findByApplicationId:', error);
      throw error;
    }
  }
}

module.exports = FirstAppeal;