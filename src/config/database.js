const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'une.eee.mytemp.website',
  user: process.env.DB_USER || 'dbnexintel',
  password: process.env.DB_PASSWORD || 'dbnexintel@123',
  database: process.env.DB_NAME || 'RTI',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;