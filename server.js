const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const rooms = new Set();

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatHat Bot';

// Run when client connects
io.on('connection', socket => {
  // Adding new room
  socket.on('addRoom', (room) =>{
    rooms.add(room);
  })

  // sending roomIDs
  socket.on('validity', ({ username, room })=>{
    if(rooms.has(room)){
      socket.emit('sucess');
    }
    else{
      socket.emit('failed');
    }
    
  });

  // joining room
  socket.on('joinRoom', ({ username, room, host }) => {
    const user = userJoin(socket.id, username, room, host);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, `${user.username} Welcome to ChatHat!`));


    // // whisper
    // socket.on('typing',()=>{
    //   socket.broadcast
    //   .to(user.room)
    //   .emit("notifyTyping", ({user : user.username}) ); 
    // }); 

    // socket.on("stopTyping", () => { socket.broadcast.to(user.room).emit("notifyStopTyping"); });

    // Broadcast when a user connects
    var username = user.username
    var des = 1
    socket.broadcast
      .to(user.room)
      .emit(
        'message-joinedleft',({ username, des})
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    
    if (user) {
      var des = 0
      var username = user.username
      io.to(user.room).emit(
        'message-joinedleft',({username, des})
      );
      if (user.host===1){
        rooms.delete(user.room)
        io.to(user.room).emit('host-left')
      }
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);