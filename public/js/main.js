const socket = io();
const chatForm = document.getElementById("chat-form");


socket.on("message", message=>{
    console.group(message);
})


chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    // Get Message from user
    const msg = e.target.elements.msg.value;

    // send message to server
    socket.emit("chatMessage", msg)
})