const mysql = require('mysql');
require('dotenv').config();  // Ensure environment variables are loaded

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Successfully connected to the database.');
});

// Function to get users
const getUsers = (callback) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) throw error;
    callback(results);
  });
};

// Export the database operations
module.exports = {
  getUsers
};
