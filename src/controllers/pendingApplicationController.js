const PendingApplication = require('../models/pendingApplication');
const ErrorLogger = require('../utils/errorLogger');

const pendingApplicationController = {
  async getAll(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const results = await PendingApplication.getAll(parseInt(userId));
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      await ErrorLogger.logError('GetPendingApplications', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = pendingApplicationController;