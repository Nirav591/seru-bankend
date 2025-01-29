const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',        // Default MySQL username in XAMPP
    password: '',        // Default MySQL password is empty in XAMPP
    database: 'seru',  // Your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
