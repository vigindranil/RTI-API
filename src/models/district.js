const pool = require('../config/database');

class District {
  static async create({ districtName, stateId, userId }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertDistrict(?, ?, ?, @error_code)',
      [districtName, stateId, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(stateId, districtId) {
    const [results] = await pool.execute(
      'CALL GetDistrict(?, ?)',
      [stateId || null, districtId || null]
    );
    return results[0];
  }
}

module.exports = District;