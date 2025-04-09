const pool = require('../config/database');

class PoliceStation {
  static async create({ policestationName, districtId, userId }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertPoliceStation(?, ?, ?, @error_code)',
      [policestationName, districtId, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(districtId = 0) {
    const [results] = await pool.execute(
      'CALL GetPoliceStations(?)',
      [districtId]
    );
    return results[0];
  }
}

module.exports = PoliceStation;