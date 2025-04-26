const pool = require('../config/database');

class CommitteeMeeting {
  static async create(meetingData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert committee meeting members
      for (const member of meetingData.memberDtls) {
        await connection.execute('SET @result_code = 0');
        await connection.execute(
          'CALL insert_committe_meeting_member(?, ?, ?, ?, @result_code)',
          [
            meetingData.meeting_id,
            member.member_id,
            member.present_type,
            member.present_type === 'representative' ? member.representative_name : null
          ]
        );

        const [[{ result_code }]] = await connection.execute('SELECT @result_code as result_code');
        if (result_code !== 0) {
          throw new Error('Failed to insert committee meeting member');
        }
      }

      // Process meeting details
      for (const meeting of meetingData.meetingDtls) {
        for (const remarkDetail of meeting.remarkDtls) {
          // Insert meeting remark
          await connection.execute('SET @inserted_id = 0, @error_code = 0');
          await connection.execute(
            'CALL insert_committe_meeting_remark(?, ?, ?, ?, ?, ?, ?, @inserted_id, @error_code)',
            [
              meeting.application_id,
              remarkDetail.action,
              null, // reason
              remarkDetail.remark || null,
              null, // timeline
              meetingData.meeting_id,
              meetingData.user_id
            ]
          );

          const [[{ inserted_id, error_code }]] = await connection.execute('SELECT @inserted_id as inserted_id, @error_code as error_code');
          if (error_code !== 0 || !inserted_id) {
            throw new Error('Failed to insert committee meeting remark');
          }

          // Process query details
          if (remarkDetail.queryDtls && remarkDetail.queryDtls.length > 0) {
            for (const query of remarkDetail.queryDtls) {
              await connection.execute('SET @error_code = 0');
              await connection.execute(
                'CALL insert_committe_meeting_query(?, ?, @error_code)',
                [query.query_id, inserted_id]
              );

              const [[{ error_code: queryError }]] = await connection.execute('SELECT @error_code as error_code');
              if (queryError !== 0) {
                throw new Error('Failed to insert committee meeting query');
              }
            }
          }

          // Process endorse details
          if (remarkDetail.endorseDtls && remarkDetail.endorseDtls.length > 0) {
            for (const endorse of remarkDetail.endorseDtls) {
              await connection.execute('SET @error_code = 0');
              await connection.execute(
                'CALL insert_committe_meeting_endorse(?, ?, ?, ?, @error_code)',
                [endorse.endorse_id, inserted_id, null, null]
              );

              const [[{ error_code: endorseError }]] = await connection.execute('SELECT @error_code as error_code');
              if (endorseError !== 0) {
                throw new Error('Failed to insert committee meeting endorse');
              }
            }
          }

          // Process department details
          if (remarkDetail.departmentDtls && remarkDetail.departmentDtls.length > 0) {
            for (const dept of remarkDetail.departmentDtls) {
              await connection.execute('SET @error_code = 0');
              await connection.execute(
                'CALL insert_committe_meeting_department(?, ?, ?, ?, @error_code)',
                [dept.department_id, inserted_id, null, null]
              );

              const [[{ error_code: deptError }]] = await connection.execute('SELECT @error_code as error_code');
              if (deptError !== 0) {
                throw new Error('Failed to insert committee meeting department');
              }
            }
          }
        }
      }

      await connection.commit();
      return { success: true, message: 'Committee meeting details saved successfully' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = CommitteeMeeting;