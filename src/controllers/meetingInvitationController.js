const MeetingInvitation = require('../models/meetingInvitation');
const ErrorLogger = require('../utils/errorLogger');

const meetingInvitationController = {
  async getMeetingInvitationDetails(req, res) {
    try {
      const { applicationNo, meetingId, userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const results = await MeetingInvitation.getDetails(
        applicationNo,
        meetingId ? parseInt(meetingId) : null,
        parseInt(userId)
      );

      res.json(results);
    } catch (error) {
      await ErrorLogger.logError('GetMeetingInvitationDetails', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = meetingInvitationController;