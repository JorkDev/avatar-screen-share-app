const db = require('./db');

const User = {
    // Create a new user in the database
    createUser: (email, password) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
            db.query(query, [email, password], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    },

    // Find a user by email (for login)
    findUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            db.query(query, [email], (err, result) => {
                if (err) return reject(err);
                if (result.length === 0) return resolve(null);  // No user found
                resolve(result[0]);  // Return the user data
            });
        });
    }
};

module.exports = User;
