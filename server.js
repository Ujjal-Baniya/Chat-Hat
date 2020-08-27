const express = require("express");
const path = require("path");
const http = require('http');
const socketio = require("socket.io");
const { Socket } = require("dgram");


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when user connects
io.on("connect", socket => {
    socket.emit('message',"Welcome to Chat-Hat")

    // broadcast when user enters
    socket.broadcast.emit("message", "A user has joined the chat")

    // run when user disconnect
    socket.on("disconnect", ()=>{
        io.emit("message", "A user has left the chat")
    }) 
})



//run when user disconnects
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{console.log(`server is running in ${PORT}`)});