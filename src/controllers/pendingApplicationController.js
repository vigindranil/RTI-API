const PendingApplication = require('../models/pendingApplication');
const ErrorLogger = require('../utils/errorLogger');

const pendingApplicationController = {
  async getAll(req, res) {
    try {
      const results = await PendingApplication.getAll();
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