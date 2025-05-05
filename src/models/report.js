const pool = require('../config/database');

class Report {
  static async getApplicationReport(formattedStartDate, formattedEndDate) {
    const [results] = await pool.execute('CALL sp_get_application_report(?, ?)', [
      formattedStartDate,
      formattedEndDate
    ]);
    
    // Transform the results to match the expected format
    return results[0].map(row => ({
      pollution_name: row.pollution_name,
      appNO_before_current_year: row.appNO_before_current_year.toString(),
      appNO_current_year: row.appNO_current_year.toString(),
      disposed_before_current_year: row.disposed_before_current_year.toString(),
      disposed_current_year: row.disposed_current_year.toString(),
      pending_before_current_year: row.pending_before_current_year.toString(),
      pending_current_year: row.pending_current_year.toString()
    }));
  }

  static getFinancialYearStartEnd(year) {
    return {
      start: new Date(year - 1, 3, 1),
      end: new Date(year, 3, 1)
    };
  }

  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static calculateAnnualYearDates(yearValue, period, subPeriod) {
    let startDate, endDate;
    
    switch (period) {
      case 'yearly':
        startDate = new Date(yearValue, 0, 1);
        endDate = new Date(yearValue + 1, 0, 1);
        break;
      case 'half-yearly':
        if (subPeriod == 1) {
          startDate = new Date(yearValue, 0, 1);
          endDate = new Date(yearValue, 6, 1);
        }
        else if (subPeriod == 2) {
          startDate = new Date(yearValue, 6, 1);
          endDate = new Date(yearValue + 1, 0, 1);
        }
        else {
          throw new Error('Invalid half-year. Must be 1 or 2.');
        }
        break;
      case 'quarterly':
        if (![1, 2, 3, 4].includes(parseInt(subPeriod))) {
          throw new Error('Invalid quarter. Quarter must be 1, 2, 3, or 4.');
        }
        const startMonth = (subPeriod - 1) * 3;
        startDate = new Date(yearValue, startMonth, 1);
        endDate = new Date(yearValue, startMonth + 3, 1);
        break;
      case 'monthly':
        const month = parseInt(subPeriod) - 1;
        if (month < 0 || month > 11) {
          throw new Error('Invalid month. Month must be between 1 and 12.');
        }
        startDate = new Date(yearValue, month, 1);
        endDate = new Date(yearValue, month + 1, 1);
        break;
      default:
        throw new Error('Invalid period for annual-year. Must be yearly, half-yearly, monthly, or quarterly.');
    }
    
    return { startDate, endDate };
  }

  static calculateFinancialYearDates(yearValue, period, subPeriod) {
    let startDate, endDate;
    const fy = this.getFinancialYearStartEnd(yearValue);
    
    switch (period) {
      case 'yearly':
        startDate = fy.start;
        endDate = fy.end;
        break;
      case 'half-yearly':
        if (subPeriod == 1) {
          startDate = fy.start;
          endDate = new Date(yearValue - 1, 9, 1);
        }
        else if (subPeriod == 2) {
          startDate = new Date(yearValue - 1, 9, 1);
          endDate = fy.end;
        }
        else {
          throw new Error('Invalid half-year. Must be 1 or 2.');
        }
        break;
      case 'quarterly':
        if (![1, 2, 3, 4].includes(parseInt(subPeriod))) {
          throw new Error('Invalid quarter. Quarter must be 1, 2, 3, or 4.');
        }
        const fyStartMonth = (subPeriod - 1) * 3 + 3;
        const startYear = yearValue - 1 + (fyStartMonth >= 12 ? 1 : 0);
        const startMonth = fyStartMonth % 12;
        const endMonth = (fyStartMonth + 3) % 12;
        startDate = new Date(startYear, startMonth, 1);
        const endYear = startYear + (endMonth < startMonth ? 1 : 0);
        endDate = new Date(endYear, endMonth, 1);
        break;
      case 'monthly':
        const fyMonth = (parseInt(subPeriod) + 2) % 12;
        if (fyMonth < 0 || fyMonth > 11) {
          throw new Error('Invalid month. Month must be between 1 and 12.');
        }
        startDate = new Date(yearValue - 1, fyMonth, 1);
        endDate = new Date(yearValue - 1, fyMonth + 1, 1);
        if (fyMonth < 3) {
          startDate = new Date(yearValue, fyMonth, 1);
          endDate = new Date(yearValue, fyMonth + 1, 1);
        }
        break;
      default:
        throw new Error('Invalid period for financial-year. Must be yearly, half-yearly, monthly, or quarterly.');
    }
    
    return { startDate, endDate };
  }

  static calculateCustomizedDates(formDate, toDate) {
    const startDate = new Date(formDate);
    const endDate = new Date(toDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
  }
}

module.exports = Report;