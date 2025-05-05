const RTISystemReport = require('../models/rtiSystemReport');
const ErrorLogger = require('../utils/errorLogger');

const rtiSystemReportController = {
  async getReport(req, res) {
    try {
      const data = await RTISystemReport.getReport(req.query);
      
      res.json({
        errorCode: 0,
        data
      });
    } catch (error) {
      await ErrorLogger.logError('GetRTISystemReport', error);
      res.status(500).json({
        errorCode: 1,
        data: null
      });
    }
  }
};

module.exports = rtiSystemReportController;