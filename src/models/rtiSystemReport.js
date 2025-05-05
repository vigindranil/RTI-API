const pool = require('../config/database');

class RTISystemReport {
  static calculatePreviousStartDate(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - diffDays);
    return prevStartDate;
  }

  static calculatePreviousEndDate(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const prevEndDate = new Date(startDate);
    return prevEndDate;
  }

  static getFinancialYearStartEnd(year) {
    return {
      start: new Date(year - 1, 3, 1),
      end: new Date(year, 3, 1)
    };
  }

  static calculateDateRange(timePeriodType, period, subPeriod, year, formDate, toDate) {
    let startDate;
    let endDate;
    const currentDate = new Date();
    const yearValue = parseInt(year) || currentDate.getFullYear();

    switch (timePeriodType) {
      case 'annual-year':
        switch (period) {
          case 'yearly':
            startDate = new Date(yearValue, 0, 1);
            endDate = new Date(yearValue + 1, 0, 1);
            break;
          case 'half-yearly':
            if (subPeriod == 1) {
              startDate = new Date(yearValue, 0, 1);
              endDate = new Date(yearValue, 6, 1);
            } else if (subPeriod == 2) {
              startDate = new Date(yearValue, 6, 1);
              endDate = new Date(yearValue + 1, 0, 1);
            } else {
              throw new Error('Invalid half-year. Must be 1 or 2.');
            }
            break;
          case 'quarterly':
            if (![1, 2, 3, 4].includes(parseInt(subPeriod))) {
              throw new Error('Invalid quarter. Quarter must be 1, 2, 3, or 4.');
            }
            const startMonth = (parseInt(subPeriod) - 1) * 3;
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
        break;

      case 'financial-year':
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
            } else if (subPeriod == 2) {
              startDate = new Date(yearValue - 1, 9, 1);
              endDate = fy.end;
            } else {
              throw new Error('Invalid half-year. Must be 1 or 2.');
            }
            break;
          case 'quarterly':
            if (![1, 2, 3, 4].includes(parseInt(subPeriod))) {
              throw new Error('Invalid quarter. Quarter must be 1, 2, 3, or 4.');
            }
            const fyStartMonth = (parseInt(subPeriod) - 1) * 3 + 3;
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
        break;

      case 'customized':
        startDate = new Date(formDate);
        endDate = new Date(toDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
        break;

      default:
        startDate = new Date(0);
        endDate = new Date(yearValue + 1, 0, 1);
        break;
    }

    return { startDate, endDate };
  }

  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static async getReport(params) {
    const { timePeriodType, period, subPeriod, year, formDate, toDate } = params;

    const { startDate, endDate } = this.calculateDateRange(
      timePeriodType, 
      period, 
      subPeriod, 
      year, 
      formDate, 
      toDate
    );

    const formattedStartDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(endDate);
    const prevStartDate = this.formatDate(this.calculatePreviousStartDate(startDate, endDate));
    const prevEndDate = this.formatDate(this.calculatePreviousEndDate(startDate, endDate));

    const [results] = await pool.execute(
      'CALL GetApplicationDashboardSummary(?, ?, ?, ?)',
      [formattedStartDate, formattedEndDate, prevStartDate, prevEndDate]
    );

    const [basicSummary, transferred, firstAppealSummary, sectionWiseCount, designationCount] = results;

    return {
      data1: {
        Indirect: basicSummary[0].Indirect.toString(),
        Direct: basicSummary[0].Direct.toString(),
        Reject: basicSummary[0].Reject.toString(),
        Replied: basicSummary[0].Replied.toString(),
        TotalFees: basicSummary[0].TotalFees.toString(),
        AdditionalFees: basicSummary[0].AdditionalFees.toString(),
        appeals_Previously: basicSummary[0].appeals_Previously.toString()
      },
      data2: {
        Transferred: transferred[0].Transferred.toString()
      },
      data3: {
        FA_Direct: firstAppealSummary[0].FA_Direct.toString(),
        FA_Replied: firstAppealSummary[0].FA_Replied.toString(),
        FA_Previously: firstAppealSummary[0].FA_Previously.toString()
      },
      data4: sectionWiseCount.map(item => ({
        sectionNo: item.sectionNo,
        applicationCount: item.applicationCount.toString()
      })),
      data5: designationCount || []
    };
  }
}

module.exports = RTISystemReport;