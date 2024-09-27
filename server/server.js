const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();

// Create the HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const db = require('../models/db');
const User = require('../models/User');

// Helper function to generate random room IDs
const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 9);
};

// Register User Route
app.post('/api/register', async (req, res) => {
    console.log('Register request received:', req.body);  // Log the incoming request data
    const { email, password } = req.body;
    try {
        const result = await User.createUser(email, password);
        console.log('User registered:', result);  // Log the result from the database
        const userId = result.insertId;  // Get the inserted user ID
        res.json({ message: 'User registered successfully!', userId });
    } catch (err) {
        console.error('Error registering user:', err);  // Log any errors
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login User Route
app.post('/api/login', async (req, res) => {
    console.log('Login request received:', req.body);  // Log the incoming request data
    const { email, password } = req.body;
    try {
        const user = await User.findUserByEmail(email);
        if (!user || user.password !== password) {
            console.log('Invalid email or password');  // Log invalid login attempts
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('User logged in:', user);  // Log successful login
        res.json({ message: 'Login successful', userId: user.id });
    } catch (err) {
        console.error('Error logging in user:', err);  // Log any errors
        res.status(500).json({ message: 'Error logging in user' });
    }
});

// Create Room Route
app.post('/api/create-room', (req, res) => {
    const roomId = generateRandomId();
    res.json({ roomId });
});

// Join Room Route (optional - if you need any special handling for joining rooms)
app.post('/api/join-room', async (req, res) => {
    const { roomId } = req.body;
    try {
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Error joining room' });
    }
});

// Socket.IO logic for chat functionality
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for chat messages
    socket.on('chatMessage', (data) => {
        console.log('Received message:', data);
        io.emit('chatMessage', data);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
