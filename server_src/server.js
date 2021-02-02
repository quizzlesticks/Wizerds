const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const map = require("../client_src/js/MapManager.js");
console.log(map);

const connected_users = {};
var connected_users_count = 0;

app.use(express.static(path.join(__dirname,'../client_src/')));
//DELETEME
app.use('/Audio', express.static(path.join(__dirname,'../client_src/assets/audio')));
app.use('/Spritesheets', express.static(path.join(__dirname,'../client_src/assets/spritesheets')));
app.use('/fav', express.static(path.join(__dirname,'../client_src/assets/favicon')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client_src/index.html'));
});

//We can use io.emit to have the server send messages to people

io.on('connection', (socket) => {
    //message back to sender, just use socket.emit
    //message to all in room, use socket.to('room').emit (won't send to sender)
    //message to all, use socket.broadcast.emit (also won't send to sender)
    socket.join('main_lobby');

    console.log(socket.id + ' connected');

    socket.on('player_selected', (data)=> {
        socket.emit('update_connected_list', connected_users);
        data['id'] = socket.id;
        connected_users[socket.id] = data;
        connected_users_count++;
        socket.to('main_lobby').emit('new_player_connected', data);
    });

    socket.on('player_move', (data)=> {
        connected_users[socket.id]['pos'] = data['pos'];
        connected_users[socket.id]['last_state'] = data['last_state'];
        data['id'] = socket.id;
        socket.to('main_lobby').emit('player_move', data);
    });

    socket.on('bullet_fire', (data)=> {
        socket.to('main_lobby').emit('bullet_fire', data);
    });

    socket.once('disconnect', () => {
        if(connected_users[socket.id] != undefined) {
            connected_users_count--;
        }
        console.log(socket.id + ' disconnected');
        socket.leave("main_lobby");
        delete connected_users[socket.id];
        socket.to('main_lobby').emit('player_left', socket.id);
    });
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});

setInterval(loop, 200);

function loop() {

}
