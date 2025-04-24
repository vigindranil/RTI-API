const pool = require('../config/database');

class MeetingInvitation {
  static async getDetails(applicationNo, meetingId, userId) {
    const connection = await pool.getConnection();
    try {
      // Get meeting invitation details
      const [results] = await connection.execute(
        'CALL GetMeetingInvitationDetails(?, ?, ?)',
        [applicationNo || '', meetingId || 0, userId]
      );

      const meetingInvitations = results[0] || [];
      // Process each meeting invitation
      for (const invitation of meetingInvitations) {
        try {
          // Get invitation members
          const [membersResult] = await connection.execute(
            'CALL GetInvitationMembersByMeetingId(?)',
            [invitation.id]
          );
          invitation.invitation_members = membersResult[0] || [];

          // Get committee member details for each invitation member
          for (const member of invitation.invitation_members) {
            if (member.committe_member_id) {
              const [committeeMemberResult] = await connection.execute(
                'CALL GetCommitteeMemberById(?)',
                [member.committe_member_id]
              );
              // If no committee member found, set an empty object
              member.committe_member = committeeMemberResult[0]?.[0] || {};
            } else {
              member.committe_member = {};
            }
          }

          // Get invitation applications
          const [applicationsResult] = await connection.execute(
            'CALL GetInvitationApplicationsByMeetingId(?)',
            [invitation.id]
          );
          invitation.invitation_application = applicationsResult[0] || [];

          // Get application info for each invitation application
          for (const application of invitation.invitation_application) {
            if (application.application_id) {
              const [applicationInfoResult] = await connection.execute(
                'CALL GetApplicationInfoById(?)',
                [application.application_id]
              );
              // If no application info found, set an empty object
              application.application_info = applicationInfoResult[0]?.[0] || {};

              // Get applicant queries for this application
              if (application.application_id) {
                const [queriesResult] = await connection.execute(
                  'CALL get_applicant_query_by_application_id(?)',
                  [application.application_id]
                );
                application.application_info.applicant_querys = queriesResult[0] || [];
              }
            } else {
              application.application_info = {
                applicant_querys: []
              };
            }
          }

        } catch (error) {
          console.error(`Error processing meeting invitation ${invitation.id}:`, error);
          // Initialize empty arrays if there's an error
          invitation.invitation_members = [];
          invitation.invitation_application = [];
          continue;
        }
      }

      return {
        success: true,
        data: meetingInvitations
      };
    } catch (error) {
      console.error('Error in getDetails:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getMeetingIdAndNumber(userId) {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute('CALL GetMeetingIdAndNumber(?)', [userId]);
      return {
        success: true,
        data: results[0] || []
      };
    } catch (error) {
      console.error('Error in getMeetingIdAndNumber:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async create(invitationData) {
    const connection = await pool.getConnection();
    try {
      console.log('Starting transaction with data:', JSON.stringify(invitationData, null, 2));
      await connection.beginTransaction();

      // Insert meeting invitation
      console.log('Executing insert_meeting_invitation...');
      await connection.execute('SET @meeting_invitation_id = 0, @error_code = 0');
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

      const [[{ meeting_invitation_id, error_code }]] = await connection.execute('SELECT @meeting_invitation_id as meeting_invitation_id, @error_code as error_code');
      console.log('Meeting invitation result:', { meeting_invitation_id, error_code });
      
      if (error_code === 2) {
        throw new Error('Meeting number already exists');
      }
      
      if (error_code !== 0 || !meeting_invitation_id) {
        throw new Error(`Failed to create meeting invitation. Error code: ${error_code}`);
      }

      // Insert invitation members
      console.log('Processing invitation members...');
      const memberArray = JSON.parse(invitationData.invitation_members);
      for (const member of memberArray) {
        console.log('Executing insert_invitation_member for member ID:', member.committe_member_id);
        await connection.execute('SET @error_code = 0');
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
        await connection.execute('SET @error_code = 0');
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
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = MeetingInvitation;