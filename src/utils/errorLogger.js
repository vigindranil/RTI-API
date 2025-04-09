const pool = require('../config/database');

class ErrorLogger {
  static async logError(procedureName, error) {
    try {
      const errorMessage = error.message || 'Unknown error';
      const errorCode = error.code || error.errno || 500;

      await pool.execute(
        'INSERT INTO error_log (procedure_name, error_message, error_code) VALUES (?, ?, ?)',
        [procedureName, errorMessage, errorCode]
      );
    } catch (logError) {
      console.error('Error logging to database:', logError);
    }
  }
}

module.exports = ErrorLogger;