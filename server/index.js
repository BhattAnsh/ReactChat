const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./path/to/your/user-utils');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  // Handle user joining a room
  socket.on('join', ({ username, room }, callback) => {
    const { status, error, user } = addUser({ id: socket.id, username, room });

    if (!status) {
      return callback({ status, error });
    }

    socket.join(user.room);

    // Welcome the current user
    socket.emit('event', {
      username: 'Admin',
      text: 'Welcome!',
      createdAt: new Date().getTime()
    });

    // Notify others in the room
    socket.broadcast.to(user.room).emit('event', {
      username: 'Admin',
      text: `${user.username} has joined!`,
      createdAt: new Date().getTime()
    });

    // Send room data
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback({ status: true });
  });

  // Handle user sending a message
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        username: user.username,
        text: message,
        createdAt: new Date().getTime()
      });
    }
    callback();
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        username: 'Admin',
        text: `${user.username} has left.`,
        createdAt: new Date().getTime()
      });

      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Server is up on port 3000');
});
