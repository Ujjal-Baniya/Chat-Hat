const express = require("express");
const path = require("path");
const http = require('http');
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "ChatHat Bot";

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when user connects
io.on("connect", socket => {

    // Welcome new user
    socket.emit('message', formatMessage(botName, "Welcome to Chat-Hat"));

    // broadcast when user enters 
    socket.broadcast.emit("message", formatMessage(botName, "A user has joined the chat"));

    // run when user disconnect
    socket.on("disconnect", ()=>{
        io.emit("message", formatMessage(botName, "A user has left the chat"));
    }) 

    // listen for chat message
    socket.on("chatMessage", (msg)=>{
        console.log(msg);
        io.emit("message",formatMessage("USER", msg));
    })
})



//run when user disconnects
const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=>{console.log(`server is running in ${PORT}`)});