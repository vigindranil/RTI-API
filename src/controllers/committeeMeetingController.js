const CommitteeMeeting = require('../models/committeeMeeting');
const ErrorLogger = require('../utils/errorLogger');

const committeeMeetingController = {
  async createMeetingDetails(req, res) {
    try {
      const meetingData = req.body;

      // Validate required fields
      if (!meetingData.meeting_id || !meetingData.user_id) {
        return res.status(400).json({
          success: false,
          message: 'meeting_id and user_id are required'
        });
      }

      if (!meetingData.memberDtls || !Array.isArray(meetingData.memberDtls) || meetingData.memberDtls.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'memberDtls is required and must be a non-empty array'
        });
      }

      // Validate member details
      for (const member of meetingData.memberDtls) {
        if (!member.member_id || !member.present_type) {
          return res.status(400).json({
            success: false,
            message: 'Each member must have member_id and present_type'
          });
        }

        if (member.present_type === 'representative' && !member.representative_name) {
          return res.status(400).json({
            success: false,
            message: 'representative_name is required when present_type is representative'
          });
        }
      }

      // Validate meeting details
      if (!meetingData.meetingDtls || !Array.isArray(meetingData.meetingDtls)) {
        return res.status(400).json({
          success: false,
          message: 'meetingDtls must be an array'
        });
      }

      const result = await CommitteeMeeting.create(meetingData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createMeetingDetails:', error);
      await ErrorLogger.logError('CreateMeetingDetails', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create committee meeting details'
      });
    }
  }
};

module.exports = committeeMeetingController;