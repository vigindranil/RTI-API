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
         
          const invitationMembers = membersResult[0] || [];

          // Get committee member details for each invitation member
          for (const member of invitationMembers) {
            if (member.committe_member_id) {
              const [committeeMemberResult] = await connection.execute(
                'CALL GetCommitteeMemberById(?)',
                [member.committe_member_id]
              );
              member.committe_member = committeeMemberResult[0][0] || null;
            }
          }
          invitation.invitation_members = invitationMembers;

          // Get invitation applications
          const [applicationsResult] = await connection.execute(
            'CALL GetInvitationApplicationsByMeetingId(?)',
            [invitation.id]
          );
          const invitationApplications = applicationsResult[0] || [];

          // Get application info for each invitation application
          for (const application of invitationApplications) {
            if (application.application_id) {
              const [applicationInfoResult] = await connection.execute(
                'CALL GetApplicationInfoById(?)',
                [application.application_id]
              );
              application.application_info = applicationInfoResult[0][0] || null;
            }
          }
          invitation.invitation_application = invitationApplications;

        } catch (error) {
          console.error(`Error processing meeting invitation ${invitation.id}:`, error);
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
}

module.exports = MeetingInvitation;