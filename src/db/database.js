const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createPool({
    connectionLimit : 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.getConnection(err => {
    if (err) throw err; // Not connected
    console.log('Connected to the database successfully!');
});

module.exports = connection;
