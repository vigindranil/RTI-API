const pool = require('../config/database');

class MeetingInvitation {
  static async create(invitationData) {
    const connection = await pool.getConnection();
    try {
      console.log('Starting transaction with data:', JSON.stringify(invitationData, null, 2));
      await connection.beginTransaction();

      // Initialize output variables
      await connection.execute('SET @meeting_invitation_id = NULL');
      await connection.execute('SET @error_code = NULL');

      // Insert meeting invitation
      console.log('Executing insert_meeting_invitation...');
      await connection.execute(
        'CALL insert_meeting_invitation(?, ?, ?, ?, ?, ?, ?, @meeting_invitation_id, @error_code)',
        [
          invitationData.invitation_date,
          invitationData.meeting_date,
          invitationData.meeting_time,
          invitationData.meeting_venue,
          invitationData.file_no,
          invitationData.user_id,
          invitationData.meeting_no
        ]
      );

      // Get the output parameters
      const [[outParams]] = await connection.execute('SELECT @meeting_invitation_id as meeting_invitation_id, @error_code as error_code');
      console.log('Meeting invitation result:', outParams);
      
      if (outParams.error_code === 2) {
        throw new Error('Meeting number already exists');
      }

      if (outParams.error_code === 3) {
        throw new Error('User not exist');
      }
      
      if (outParams.error_code !== 0 || !outParams.meeting_invitation_id) {
        throw new Error(`Failed to create meeting invitation. Error code: ${outParams.error_code}`);
      }

      const meeting_invitation_id = outParams.meeting_invitation_id;

      // Insert invitation members
      console.log('Processing invitation members...');
      const memberArray = JSON.parse(invitationData.invitation_members);
      for (const member of memberArray) {
        console.log('Executing insert_invitation_member for member ID:', member.committe_member_id);
        await connection.execute('SET @error_code = NULL');
        await connection.execute(
          'CALL insert_invitation_member(?, ?, @error_code)',
          [
            member.committe_member_id,
            meeting_invitation_id
          ]
        );
        const [[memberResult]] = await connection.execute('SELECT @error_code as error_code');
        console.log('Member result:', memberResult);
        
        if (memberResult.error_code !== 0) {
          throw new Error(`Failed to add member with ID ${member.committe_member_id}. Error code: ${memberResult.error_code}`);
        }
      }

      // Insert invitation applications
      console.log('Processing invitation applications...');
      const applicationArray = JSON.parse(invitationData.invitation_application);
      for (const application of applicationArray) {
        console.log('Executing insert_invitation_application for application ID:', application.application_id);
        await connection.execute('SET @error_code = NULL');
        await connection.execute(
          'CALL insert_invitation_application(?, ?, @error_code)',
          [
            application.application_id,
            meeting_invitation_id
          ]
        );
        const [[applicationResult]] = await connection.execute('SELECT @error_code as error_code');
        console.log('Application result:', applicationResult);
        
        if (applicationResult.error_code !== 0) {
          throw new Error(`Failed to add application with ID ${application.application_id}. Error code: ${applicationResult.error_code}`);
        }
      }

      await connection.commit();
      console.log('Transaction committed successfully');
      return { 
        success: true, 
        message: 'Meeting invitation created successfully',
        meeting_invitation_id
      };
    } catch (error) {
      console.error('Error in create meeting invitation:', error);
      await connection.rollback();
      if (error.message === 'Meeting number already exists') {
        return { success: false, message: 'Meeting number already exists' };
      }
      if (error.message === 'User not exist') {
        return { success: false, message: 'User not exist' };
      }
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = MeetingInvitation;