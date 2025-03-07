const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  // mysql my house pasta
  host: 'localhost',
  user: 'root',
  password: 'Barney1234!',
  database: 'pokemon',
});

module.exports = pool;
