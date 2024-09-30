const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
    }
});

require('dotenv').config();

app.use(express.json());

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('play-audio', (data) => {
        io.emit('play-audio', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/status', (req, res) => {
    return res.status(200).json({
        msg: 'Working',
    });
});

app.post('/emit-play-audio', (req, res) => {
    const { audio } = req.body;
    if (!audio) {
        return res.status(400).json({ error: 'No audio data provided.' });
    }

    io.emit('play-audio', { audio });

    res.status(200).json({ success: true, message: 'Audio emitted to clients.' });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});