const Application = require('../models/application');
const ErrorLogger = require('../utils/errorLogger');

const applicationController = {
  async getApplicationsByStatus(req, res) {
    try {
      const { userId, status } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const results = await Application.getByUserAndStatus(
        parseInt(userId),
        status ? parseInt(status) : 0
      );

      res.json(results);
    } catch (error) {
      await ErrorLogger.logError('GetApplicationsByStatus', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = applicationController;