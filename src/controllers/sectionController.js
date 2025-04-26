const Section = require('../models/section');
const ErrorLogger = require('../utils/errorLogger');

const sectionController = {
  async getAll(req, res) {
    try {
      const results = await Section.getAll();
      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      await ErrorLogger.logError('GetSection', error);
      res.status(500).json({
        success: false,
        data: []
      });
    }
  }
};

module.exports = sectionController;