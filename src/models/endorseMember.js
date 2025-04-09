const pool = require('../config/database');

class EndorseMember {
  static async create({
    designation,
    organization,
    address,
    email,
    userId
  }) {
    await pool.execute('SET @error_code = 0');
    
    await pool.execute(
      'CALL InsertEndorseMember( ?, ?, ?, ?, ?, @error_code)',
      [ designation, organization, address, email, userId]
    );

    const [[{ error_code }]] = await pool.execute('SELECT @error_code as error_code');
    return error_code;
  }

  static async get(userId) {    const [results] = await pool.execute(
      'CALL GetEndorseMemberByUser(?)',
      [userId]
    );
    return results[0];
  }
}

module.exports = EndorseMember;