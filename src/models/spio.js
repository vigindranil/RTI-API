const pool = require('../config/database');

class Spio {
  static async create({
    name,
    designation,
    contactNumber,
    email,
    officeAddress,
    description,
    departmentId,
    userId,
    districtId
  }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertSpio(?, ?, ?, ?, ?, ?, ?, ?, ?, @error_code)',
      [name, designation, contactNumber, email, officeAddress, description, 
       departmentId, userId, districtId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(stateId, departmentId, districtId, spioId) {
    const [results] = await pool.execute(
      'CALL GetSpioDetails(?, ?, ?, ?)',
      [stateId || null, departmentId || null, districtId || null, spioId || null]
    );
    return results[0];
  }
}

module.exports = Spio;