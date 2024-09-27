CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roomId VARCHAR(255) NOT NULL,
    host_id INT,
    FOREIGN KEY (host_id) REFERENCES users(id)
);
