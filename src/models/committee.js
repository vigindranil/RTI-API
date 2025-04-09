const pool = require('../config/database');

class Committee {
  static async createDepartment({ departmentId, committeName, email, address, organization, userId }) {
    await pool.execute('SET @errorCode = 0');
    
    await pool.execute(
      'CALL InsertCommitteDepartmentV1(?, ?, ?, ?, ?, ?, @errorCode)',
      [departmentId, committeName, email, address, organization, userId]
    );

    const [[{ errorCode }]] = await pool.execute('SELECT @errorCode as errorCode');
    return errorCode;
  }

  static async getDepartment(departmentId = 0, userId) {
    const [results] = await pool.execute(
      'CALL GetCommitteDepartmentV1(?, ?)',
      [departmentId, userId]
    );
    return results[0];
  }

  static async createMember({ committeeId, name, designation, email, phoneNumber, userId }) {
    await pool.execute('SET @errorCode = 0');
    
    await pool.execute(
      'CALL InsertCommitteMemberV1(?, ?, ?, ?, ?, ?, @errorCode)',
      [committeeId, name, designation, email, phoneNumber, userId]
    );

    const [[{ errorCode }]] = await pool.execute('SELECT @errorCode as errorCode');
    return errorCode;
  }

  static async getMember(userId, committeeId) {
    await pool.execute('SET @errorCode = 0');
    
    const [results] = await pool.execute(
      'CALL GetCommitteMemberV1(?, ?, @errorCode)',
      [userId, committeeId]
    );

    const [[{ errorCode }]] = await pool.execute('SELECT @errorCode as errorCode');
    
    if (errorCode !== 0) {
      throw new Error('Failed to get committee members');
    }
    
    return results[0];
  }
}

module.exports = Committee;