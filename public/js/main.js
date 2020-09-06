const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const html = document.querySelector('html');

// Get username and room from URL
var { username, room ,check, RoomID} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
const socket = io();

// Join chatroom
if (room=="Public"){
  var host = 0
  socket.emit('joinRoom', { username, room, host });
}
else{
    if(check=="no"){
      room = RoomID;
      socket.emit('validity', { username, room });
      socket.on('sucess',()=>{
        host = 0
        socket.emit('joinRoom', { username, room, host});
      })
      socket.on('failed',()=>{
          html.innerHTML = `<strong>Page NOT Found</strong>`
      })
    }
    else{
      room = check
      host = 1
      socket.emit('addRoom', room)
      socket.emit('joinRoom', { username, room , host});
    }
}

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  outputMessage(message);


// when user join and leave chat
socket.on('message-joinedleft', ({username, des})=>{
  joinleft(username, des);
})
  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});

// Host left
socket.on('host-left',()=>{
  chatForm.innerHTML = ``
  const span = document.createElement('span');
  span.classList.add('joined-left');
  span.innerHTML = `Host has left the room or disconnected. Please host a  <a href="https://chat-hat.herokuapp.com">new room</a>.
                    <br>Or wait till Host re-joins`
  document.querySelector('.chat-messages').appendChild(span);
})


// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// user join-left
function joinleft(message, des){
  const span = document.createElement('span');
  span.classList.add('joined-left');
  if(des==1){
    span.innerHTML = `${message} joined the chat`
    }
  else{
    span.innerHTML = `${message} left the chat`
  }
  document.querySelector('.chat-messages').appendChild(span);
}

// whisper
// messagebox = document.getElementById('msg')
// whisper = document.getElementById('whisper')
// messagebox.addEventListener("keypress", () =>  {          
//   socket.emit("typing");
//   });

//   socket.on("notifyTyping",({user})=>{
   
//     whisper.innerHTML = `<strong id="nam">${user}</strong> is typing....`
//   })

//   messagebox.addEventListener("keyup", () =>  {
//     socket.emit("stopTyping", "");
//     });

// socket.on("notifyStopTyping", () =>  {
//   whisper.innerHTML  =  `<span id="hide">Typing Notification</span>`;
//   });

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
