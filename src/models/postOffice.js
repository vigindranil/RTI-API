const pool = require('../config/database');

class PostOffice {
  static async create({ postOfficeName, psId, userId }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertPostOffice(?, ?, ?, @error_code)',
      [postOfficeName, psId, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(psId = 0) {
    const [results] = await pool.execute(
      'CALL GetPostOffices(?)',
      [psId]
    );
    return results[0];
  }
}

module.exports = PostOffice;