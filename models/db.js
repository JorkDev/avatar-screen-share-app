const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'avatar_user',
    password: 'password',
    database: 'avatar_app'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;
