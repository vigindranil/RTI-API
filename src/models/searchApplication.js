const pool = require('../config/database');

class SearchApplication {
  static async getApplicationInfo(isDisposed, userId, startDate, endDate, isReject) {
    try {
      // Convert boolean strings to integers for MySQL
      const disposedValue = isDisposed === 'true' ? 1 : isDisposed === 'false' ? 0 : '';
      const rejectValue = isReject === 'true' ? 1 : isReject === 'false' ? 0 : '';

      const [results] = await pool.execute(
        'CALL GetApplicationInfo(?, ?, ?, ?, ?)',
        [disposedValue, userId, startDate || '', endDate || '', rejectValue]
      );

      // The first element of results contains our data
      const applications = results[0] || [];

      // Process each application
      for (const application of applications) {
        try {
          // Get applicant queries
          const [queriesResult] = await pool.execute(
            'CALL GetApplicantQuery(?)',
            [application.id]
          );
          const queries = queriesResult[0] || [];

          // Get pollution category for each query
          for (const query of queries) {
            if (query.pollution_id) {
              const [categoryResult] = await pool.execute(
                'CALL GetCategoryById(?)',
                [query.pollution_id]
              );
              query.pollution_category = categoryResult[0][0] || null;
            }
          }
          application.applicant_querys = queries;

          // Get applicant address
          const [addressResult] = await pool.execute(
            'CALL GetApplicantAddressByApplicationId(?)',
            [application.id]
          );
          const address = addressResult[0][0] || null;

          if (address && address.district_id) {
            // Get district details
            const [districtResult] = await pool.execute(
              'CALL GetDistrictById(?)',
              [address.district_id]
            );
            address.district = districtResult[0][0] || null;
          }
          application.applicant_address = address;

          // Get application fees
          const [feesResult] = await pool.execute(
            'CALL GetApplicationFees(?)',
            [application.id]
          );
          application.application_fees = feesResult[0][0] || null;

          // Get application type
          if (application.application_type_id) {
            const [typeResult] = await pool.execute(
              'CALL GetApplicationTypeById(?)',
              [application.application_type_id]
            );
            application.application_type = typeResult[0][0] || null;
          }

          // Get application through
          if (application.application_through_id) {
            const [throughResult] = await pool.execute(
              'CALL GetApplicationThroughById(?)',
              [application.application_through_id]
            );
            console.log(throughResult);
            application.application_through = throughResult[0][0] || null;
          }
          else{
            application.application_through = null;
          }
        } catch (error) {
          console.error(`Error processing application ${application.id}:`, error);
          // Continue with next application even if there's an error with the current one
          continue;
        }
      }

      return applications;
    } catch (error) {
      console.error('Error in getApplicationInfo:', error);
      throw error;
    }
  }
}

module.exports = SearchApplication;