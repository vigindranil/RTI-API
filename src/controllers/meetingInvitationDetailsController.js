const MeetingInvitation = require('../models/meetingInvitationdetails.js');
const ErrorLogger = require('../utils/errorLogger');

const meetingInvitationController = {
    async getMeetingIdAndNumber(req, res) {
        try {
          const userId = parseInt(req.params.userId);
          console.log("UserID:" + userId);
          
          if (isNaN(userId)) {
            return res.status(400).json({
              success: false,
              message: 'Invalid user ID'
            });
          }
    
          const result = await MeetingInvitation.getMeetingIdAndNumber(userId);
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