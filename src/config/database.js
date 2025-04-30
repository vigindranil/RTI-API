const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '15.207.85.206',
  user: process.env.DB_USER || 'dbnexintel',
  password: process.env.DB_PASSWORD || 'dbnexintel@123',
  database: process.env.DB_NAME || 'RTI_test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


