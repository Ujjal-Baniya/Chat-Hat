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
  socket.emit('joinRoom', { username, room });
}
else{
    if(check=="no"){
      room = RoomID;
      socket.emit('validity', { username, room });
      socket.on('sucess',()=>{
        socket.emit('joinRoom', { username, room });
      })
      socket.on('failed',()=>{
          html.innerHTML = `<strong>Page NOT Found</strong>`
      })
    }
    else{
      room = check
      socket.emit('addRoom', room)
      socket.emit('joinRoom', { username, room });
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
