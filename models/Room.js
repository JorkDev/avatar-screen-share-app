const db = require('./db');

const Room = {
    createRoom: (host_id) => {
        return new Promise((resolve, reject) => {
            const roomId = Math.random().toString(36).substring(7);
            const query = 'INSERT INTO rooms (roomId, host_id) VALUES (?, ?)';
            db.query(query, [roomId, host_id], (err, result) => {
                if (err) return reject(err);
                resolve(roomId);
            });
        });
    },
    
    findRoomByRoomId: (roomId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM rooms WHERE roomId = ?';
            db.query(query, [roomId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
};

module.exports = Room;
