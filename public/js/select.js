var option = document.getElementsByClassName("option")
var roomdes = document.getElementById("roomdes");
const roomid = Math.random(0).toString(36).substr(2,6);

option[1].addEventListener('change', ()=>{
    var host = document.getElementById("later");
    var label1 = document.createElement("label");
    var label2 = document.createElement("label");
    label1.className = "yes option";
    label2.className = "yes option" ;
    label1.innerHTML = `Host<input type="radio" name="check" required> <i class="fa fa-check" aria-hidden="true"></i>`
    label2.innerHTML = `<input type="radio" name="check" required> <i class="fa fa-times" aria-hidden="true"></i>`
    host.appendChild(label1);
    host.appendChild(label2);
    var yes = document.getElementsByClassName("yes")
    yes[0].addEventListener('change', ()=>{
        roomdes.innerHTML = `<span>
        <br> Room ID: <strong style="font-size: 1.8em;
        letter-spacing: 0.05em;
         margin-top: 10%;
         cursor:pointer;
    ">${roomid}<strong>
        name="RoomID"
        value="${roomid}"
     </span>`
    });

    yes[1].addEventListener('change',()=>{
        roomdes.innerHTML = `<input class="inps"type="text"name="RoomID"id="roomid"placeholder="Room ID"required/>`
    });
})

option[0].addEventListener('change', ()=>{
    var host = document.getElementById("later");
    host.innerHTML = ``
    roomdes.innerHTML = ``
})
