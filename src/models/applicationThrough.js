const pool = require('../config/database');

class ApplicationThrough {
  static async create({ applicationThroughName, userId }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertApplicationThrough(?, ?, @error_code)',
      [applicationThroughName, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(userId = 0) {
    const [results] = await pool.execute(
      'CALL GetApplicationThrough(?)',
      [userId]
    );
    return results[0];
  }
}

module.exports = ApplicationThrough;