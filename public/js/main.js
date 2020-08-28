const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages")


// get username from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true 
});


// Join Room
socket.emit("joinroom", {username, room});

// Message from server
socket.on("message", message=>{
    console.group(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})


// submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    // Get Message from user
    const msg = e.target.elements.msg.value;

    // send message to server
    socket.emit("chatMessage", msg)


    // clear input
    e.target.elements.msg.value = ""
    e.target.elements.msg.foucs();    
})

// Output Message to DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add("message");
    div.innerHTML =`<p class="meta">${message.userName}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div)
}