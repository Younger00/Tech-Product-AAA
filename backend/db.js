const mysql = require('mysql2/promise');
require('dotenv').config();

console.log("Database Config -> Host:", process.env.DB_HOST, "User:", process.env.DB_USER, "Database:", process.env.DB_NAME);

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;