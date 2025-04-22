const pool = require('../config/database');

class ApplicationInfo {
  static async create(applicationData, queries) {
    const connection = await pool.getConnection();
    try {
      console.log('Starting transaction with data:', JSON.stringify(applicationData, null, 2));
      await connection.beginTransaction();

      // Insert application info
      console.log('Executing insert_application_info...');
      await connection.execute('SET @application_id = 0, @error_code = 0');
      await connection.execute(
        'CALL insert_application_info(?, ?, ?, ?, ?, ?, ?, ?, @application_id, @error_code)',
        [
          applicationData.application_no,
          applicationData.application_date,
          applicationData.application_receive_date,
          applicationData.wakalat_nama_receive === 'true' ? 1 : 0,
          applicationData.application_type_id,
          applicationData.application_through_id,
          applicationData.user_id,
          0, // is_delete
        ]
      );

      const [[{ application_id, error_code }]] = await connection.execute('SELECT @application_id as application_id, @error_code as error_code');
      console.log('Application info result:', { application_id, error_code });
      
      if (error_code === 2) {
        throw new Error('Application already exists');
      }
      
      if (error_code !== 0 || !application_id) {
        throw new Error(`Failed to create application. Error code: ${error_code}`);
      }

      // Insert applicant address
      console.log('Executing insert_applicant_address...');
      await connection.execute('SET @address_id = 0, @error_code = 0');
      await connection.execute(
        'CALL insert_applicant_address(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @address_id, @error_code)',
        [
          applicationData.applicant_name,
          applicationData.client_name || '',
          applicationData.email,
          applicationData.phone_no,
          applicationData.gender,
          applicationData.nationality,
          applicationData.identity_proof_receive === 'true' ? 1 : 0,
          applicationData.identity_no,
          applicationData.identity_file || '',
          applicationData.area,
          applicationData.address,
          applicationData.client_address,
          applicationData.village,
          applicationData.town,
          applicationData.block,
          applicationData.municipality_id,
          applicationData.ward_no,
          applicationData.panchayat,
          applicationData.state_id,
          applicationData.district_id,
          applicationData.police_station_id,
          applicationData.post_office_id,
          application_id,
          applicationData.pincode
        ]
      );

      const [[addressResult]] = await connection.execute('SELECT @address_id as address_id, @error_code as error_code');
      console.log('Address result:', addressResult);

      // Insert application fees
      console.log('Executing insert_application_fees...');
      await connection.execute('SET @fees_id = 0, @error_code = 0');
      await connection.execute(
        'CALL insert_application_fees(?, ?, ?, ?, ?, ?, ?, ?, ?, @fees_id, @error_code)',
        [
          applicationData.bpl === 'true' ? 1 : 0,
          applicationData.bpl_file || '',
          applicationData.fees_receive === 'true' ? 1 : 0,
          applicationData.fees_type_id,
          applicationData.total_fees,
          applicationData.return === 'true' ? 1 : 0,
          applicationData.fees_not_receive_reason || '',
          application_id,
          applicationData.additional_fees || 0
        ]
      );

      const [[feesResult]] = await connection.execute('SELECT @fees_id as fees_id, @error_code as error_code');
      console.log('Fees result:', feesResult);

      // Insert applicant queries
      console.log('Processing applicant queries...');
      const queryArray = JSON.parse(applicationData.applicant_query);
      for (const query of queryArray) {
        console.log('Executing insert_applicant_query for:', query);
        await connection.execute('SET @query_id = 0, @error_code = 0');
        await connection.execute(
          'CALL insert_applicant_query(?, ?, ?, ?, @query_id, @error_code)',
          [
            query.query,
            query.pollution_id,
            application_id,
            query.answer_receive === 'true' ? 1 : 0
          ]
        );
        const [[queryResult]] = await connection.execute('SELECT @query_id as query_id, @error_code as error_code');
        console.log('Query result:', queryResult);
      }

      await connection.commit();
      console.log('Transaction committed successfully');
      return { success: true, message: 'Application created successfully' };
    } catch (error) {
      console.error('Error in create application:', error);
      await connection.rollback();
      if (error.message === 'Application already exists') {
        return { success: false, message: 'Application already exists' };
      }
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = ApplicationInfo;