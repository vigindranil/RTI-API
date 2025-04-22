const MeetingInvitation = require('../models/createmeetingInvitation');
const ErrorLogger = require('../utils/errorLogger');

const meetingInvitationController = {
  async createMeetingInvitation(req, res) {
    try {
      console.log('Received request body:', JSON.stringify(req.body, null, 2));
      
      // Validate required fields
      const requiredFields = [
        'invitation_date',
        'meeting_date',
        'meeting_time',
        'meeting_venue',
        'file_no',
        'user_id',
        'meeting_no',
        'invitation_members',
        'invitation_application'
      ];

      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Validate JSON format for arrays
      try {
        const members = JSON.parse(req.body.invitation_members);
        const applications = JSON.parse(req.body.invitation_application);
        
        if (!Array.isArray(members) || !Array.isArray(applications)) {
          throw new Error('Invalid format');
        }
        
        if (members.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'At least one committee member is required'
          });
        }
        
        if (applications.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'At least one application is required'
          });
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid format for invitation_members or invitation_application'
        });
      }

      const result = await MeetingInvitation.create(req.body);
      
      if (!result.success && result.message === 'Meeting number already exists') {
        return res.status(409).json(result);
      }
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createMeetingInvitation:', error);
      await ErrorLogger.logError('CreateMeetingInvitation', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to create meeting invitation',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = meetingInvitationController;