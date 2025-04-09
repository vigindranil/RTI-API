const SearchApplication = require('../models/searchApplication');

const searchApplicationController = {
  async searchApplications(req, res) {
    try {
      const {
        isDisposed,
        userId,
        startDate,
        endDate,
        isReject
      } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const results = await SearchApplication.getApplicationInfo(
        isDisposed,
        parseInt(userId),
        startDate,
        endDate,
        isReject
      );

      res.json(results);
    } catch (error) {
      console.error('SearchApplication Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = searchApplicationController;