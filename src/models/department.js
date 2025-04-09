const pool = require('../config/database');

class Department {
  static async create({ departmentName, departmentCode, stateId, userId }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertDepartment(?, ?, ?, ?, @error_code)',
      [departmentName, departmentCode, stateId, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(departmentId = 0, stateId = 0) {
    const [results] = await pool.execute(
      'CALL GetDepartment(?, ?)',
      [departmentId, stateId]
    );
    return results[0];
  }
}

module.exports = Department;