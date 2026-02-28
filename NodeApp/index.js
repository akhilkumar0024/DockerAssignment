const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Database Configuration (Injected by Docker)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

let dbConnection = null;

// Function to connect with MySQL
function connectWithRetry() {
    console.log('Connecting to MySQL...');
    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
        if (err) {
            console.error('MySQL connection failed, retrying in 5 seconds...', err.message);
            setTimeout(connectWithRetry, 5000);
        } else {
            console.log('Successfully connected to MySQL Database!');
            dbConnection = connection;
        }
    });
}

// Start DB connection
connectWithRetry();

// Basic Express Route
app.get('/', (req, res) => {
    const status = dbConnection ? "Connected" : "Not Connected";
    res.send(`
        <h1>Hello! This is an Express.js App.</h1>
        <p>Database Status: <strong>${status}</strong></p>
    `);
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});
