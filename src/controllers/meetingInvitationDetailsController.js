const MeetingInvitation = require('../models/meetingInvitationdetails.js');
const ErrorLogger = require('../utils/errorLogger');

const meetingInvitationController = {
  async getMeetingIdAndNumber(req, res) {
    try {
      const result = await MeetingInvitation.getMeetingIdAndNumber();
      res.json(result);
    } catch (error) {
      console.error('Error in getMeetingIdAndNumber:', error);
      await ErrorLogger.logError('GetMeetingIdAndNumber', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch meeting IDs and numbers',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = meetingInvitationController;