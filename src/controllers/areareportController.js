const Report = require('../models/areareport');
const ErrorLogger = require('../utils/errorLogger');

const areareportController = {
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
  },

  async getApplicationCountByArea(req, res) {
    try {
      const { 
        timePeriodType = 'annual-year',
        period = 'yearly',
        subPeriod,
        year,
        formDate,
        toDate,
        userId
      } = req.query;

      if (!userId) {
        return res.status(400).json({
          errorCode: 1,
          message: 'userId is required'
        });
      }

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
          startDate = new Date(0);
          endDate = new Date(yearValue + 1, 0, 1);
          break;
      }

      const formattedStartDate = Report.formatDate(startDate);
      const formattedEndDate = Report.formatDate(endDate);

      const results = await Report.getApplicationCountByArea(formattedStartDate, formattedEndDate, parseInt(userId));

      res.json({
        errorCode: 0,
        data: results
      });

    } catch (error) {
      await ErrorLogger.logError('GetApplicationCountByArea', error);
      res.status(500).json({
        errorCode: 1,
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

   async getGenderwiseApplicationCount(req, res) {
    try {
      const { 
        timePeriodType = 'annual-year',
        period = 'yearly',
        subPeriod,
        year,
        fromDate,
        toDate,
        userId
      } = req.query;

      if (!userId) {
        return res.status(400).json({
          errorCode: 1,
          message: 'userId is required'
        });
      }

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
          ({ startDate, endDate } = Report.calculateCustomizedDates(fromDate, toDate));
          break;
        default:
          startDate = new Date(0);
          endDate = new Date(yearValue + 1, 0, 1);
          break;
      }

      const formattedStartDate = Report.formatDate(startDate);
      const formattedEndDate = Report.formatDate(endDate);

      const results = await Report.getGenderwiseApplicationCount(formattedStartDate, formattedEndDate, parseInt(userId));

      res.json({
        errorCode: 0,
        data: results
      });

    } catch (error) {
      console.error('Error in getGenderwiseApplicationCount:', error);
      res.status(500).json({
        errorCode: 1,
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },
  async getDistrictwiseApplicationCount(req, res) {
    try {
      const { 
        timePeriodType = 'annual-year',
        period = 'yearly',
        subPeriod,
        year,
        fromDate,
        toDate,
        userId
      } = req.query;

      if (!userId) {
        return res.status(400).json({
          errorCode: 1,
          message: 'userId is required'
        });
      }

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
          ({ startDate, endDate } = Report.calculateCustomizedDates(fromDate, toDate));
          break;
        default:
          startDate = new Date(0);
          endDate = new Date(yearValue + 1, 0, 1);
          break;
      }

      const formattedStartDate = Report.formatDate(startDate);
      const formattedEndDate = Report.formatDate(endDate);

      const results = await Report.getDistrictwiseApplicationCount(formattedStartDate, formattedEndDate, parseInt(userId));

      res.json({
        errorCode: 0,
        data: results
      });

    } catch (error) {
      console.error('Error in getDistrictwiseApplicationCount:', error);
      res.status(500).json({
        errorCode: 1,
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  async getBplApplicationCount(req, res) {
    try {
      const { 
        timePeriodType = 'annual-year',
        period = 'yearly',
        subPeriod,
        year,
        fromDate,
        toDate,
        userId
      } = req.query;

      if (!userId) {
        return res.status(400).json({
          errorCode: 1,
          message: 'userId is required'
        });
      }

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
          ({ startDate, endDate } = Report.calculateCustomizedDates(fromDate, toDate));
          break;
        default:
          startDate = new Date(0);
          endDate = new Date(yearValue + 1, 0, 1);
          break;
      }

      const formattedStartDate = Report.formatDate(startDate);
      const formattedEndDate = Report.formatDate(endDate);

      const results = await Report.getBplApplicationCount(formattedStartDate, formattedEndDate, parseInt(userId));

      res.json({
        errorCode: 0,
        data: results
      });

    } catch (error) {
      console.error('Error in getBplApplicationCount:', error);
      res.status(500).json({
        errorCode: 1,
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = areareportController;