const mysql = require('mysql2/promise'); // Ensure you use `mysql2/promise`
require('dotenv').config();

const pool = mysql.createPool({
    host: 'ls-e2029d66e023eb4cf5366724fe912a2e37ded960.czmq42a8qw3q.eu-west-2.rds.amazonaws.com',
    user: 'dbmasteruser',        // Default MySQL username in XAMPP
    password: 'London1995',        // Default MySQL password is empty in XAMPP
    database: 'seru',  // Your database name
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Async function to check database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
    }
})();

module.exports = pool;