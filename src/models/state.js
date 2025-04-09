const pool = require('../config/database');

class State {
  static async create({ stateName, userId }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertState(?, ?, @error_code)',
      [stateName, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(stateId = 0) {
    const [results] = await pool.execute(
      'CALL GetState(?)',
      [stateId]
    );
    return results[0];
  }
}

module.exports = State;