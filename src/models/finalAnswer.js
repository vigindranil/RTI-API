const pool = require('../config/database');

class FinalAnswer {
  static async create(finalAnswerData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { application_id, user_id, answerDtls } = finalAnswerData;

      for (const answerDetail of answerDtls) {
        // Insert final answer
        await connection.execute('SET @new_id = 0, @error_code = 0');
        await connection.execute(
          'CALL InsertFinalAnswer(?, ?, ?, ?, @new_id, @error_code)',
          [application_id, answerDetail.answer, user_id, null]
        );

        const [[{ new_id, error_code }]] = await connection.execute('SELECT @new_id as new_id, @error_code as error_code');
        
        if (error_code !== 0 || !new_id) {
          throw new Error('Failed to create final answer');
        }

        // Insert final answer queries
        for (const query of answerDetail.queryDtls) {
          await connection.execute('SET @error_code = 0');
          await connection.execute(
            'CALL InsertFinalAnswerQuery(?, ?, @error_code)',
            [query.query_id, new_id]
          );

          const [[{ error_code: queryError }]] = await connection.execute('SELECT @error_code as error_code');
          if (queryError !== 0) {
            throw new Error('Failed to create final answer query');
          }
        }

        // Insert final answer sections
        for (const section of answerDetail.sectionDtls) {
          await connection.execute('SET @error_code = 0');
          await connection.execute(
            'CALL InsertFinalAnswerSection(?, ?, @error_code)',
            [section.section_id, new_id]
          );

          const [[{ error_code: sectionError }]] = await connection.execute('SELECT @error_code as error_code');
          if (sectionError !== 0) {
            throw new Error('Failed to create final answer section');
          }
        }
      }

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = FinalAnswer;