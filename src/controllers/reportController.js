const Report = require('../models/report');
const ErrorLogger = require('../utils/errorLogger');

const reportController = {
  async getAllReport(req, res) {
    try {
      const { 
        timePeriodType = 'annual-year',
        period = 'yearly',
        subPeriod,
        year,
        formDate,
        toDate
      } = req.query;

      const currentDate = new Date();
      const yearValue = parseInt(year) || currentDate.getFullYear();
      let startDate, endDate;

      switch (timePeriodType) {
        case 'annual-year':
          ({ startDate, endDate } = Report.calculateAnnualYearDates(yearValue, period, subPeriod));
          break;
        case 'financial-year':
          ({ startDate, endDate } = Report.calculateFinancialYearDates(yearValue, period, subPeriod));
          break;
        case 'customized':
          ({ startDate, endDate } = Report.calculateCustomizedDates(formDate, toDate));
          break;
        default:
          startDate = new Date(yearValue, 0, 1);
          endDate = new Date(yearValue + 1, 0, 1);
          break;
      }

      const formattedStartDate = Report.formatDate(startDate);
      const formattedEndDate = Report.formatDate(endDate);

      const results = await Report.getApplicationReport(formattedStartDate, formattedEndDate);

      res.json({
        errorCode: 0,
        data: results
      });

    } catch (error) {
      await ErrorLogger.logError('GetAllReport', error);
      res.status(500).json({
        errorCode: 1,
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = reportController;