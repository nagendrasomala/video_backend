const express = require('express');
const http = require('http');
const cors = require('cors');  // Import the CORS middleware
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "https://video-s577.onrender.com",  // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Use the CORS middleware
app.use(cors({
  origin: "https://video-s577.onrender.com",  // Your frontend URL
}));

io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded');
  });

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: data.from, name: data.name });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(5000, () => console.log('server is running on port 5000'));
