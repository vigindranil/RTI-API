const ApplicationInfo = require('../models/applicationInfo');
const ErrorLogger = require('../utils/errorLogger');

const applicationInfoController = {
  async createNewApplication(req, res) {
    try {
      console.log('Received request body:', JSON.stringify(req.body, null, 2));
      
      // Validate required fields
      const requiredFields = [
        'application_no',
        'application_date',
        'application_receive_date',
        'user_id',
        'applicant_name',
        'email',
        'phone_no'
      ];

      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      const result = await ApplicationInfo.create(req.body, req.body.applicant_query);
      
      if (!result.success && result.message === 'Application already exists') {
        return res.status(409).json(result);
      }
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in createNewApplication:', error);
      await ErrorLogger.logError('CreateNewApplication', error);
      res.status(500).json({ 
        success: false, 
        message: error.message || 'Failed to create application',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = applicationInfoController;