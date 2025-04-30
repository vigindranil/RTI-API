const ApplicationWithAnswers = require('../models/applicationWithAnswers');
const ErrorLogger = require('../utils/errorLogger');

const applicationWithAnswersController = {
  async getByUser(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'userId is required',
          data: []
        });
      }

      const results = await ApplicationWithAnswers.getByUser(parseInt(userId));
      
      res.json({
        success: true,
        message: results.length > 0 ? 'Applications retrieved successfully' : 'No applications found',
        data: results
      });
    } catch (error) {
      await ErrorLogger.logError('GetApplicationsWithAnswers', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve applications',
        data: []
      });
    }
  }
};

module.exports = applicationWithAnswersController;