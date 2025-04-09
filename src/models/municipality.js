const pool = require('../config/database');

class Municipality {
  static async create({ municipalityName, districtId, userId }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertMunicipality(?, ?, ?, @error_code)',
      [municipalityName, districtId, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(districtId = 0) {
    const [results] = await pool.execute(
      'CALL GetMunicipalities(?)',
      [districtId]
    );
    return results[0];
  }
}

module.exports = Municipality;