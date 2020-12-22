const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const users = {

}

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.on('create name', (username) => {
    users[socket.id] = [username, generateUserColor(users)];
    io.emit('append user', users);
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg, channel) => {
    io.emit('chat message', msg, users[socket.id][0], users[socket.id][1], channel);
  });
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    delete users[socket.id]
    io.emit('append user', users);
  });
});

server.listen(port, () => {
  console.log('listening on *' + port);
});

function generateUserColor(users) {
  let color = Math.floor(Math.random() * 16777215).toString(16);
  if (Object.values(users).indexOf(color) > -1) {
    generateUserColor(object)
  } else {
    return color;
  }
}