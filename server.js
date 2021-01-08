const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs');
const e = require('express');

const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

const users = {

}

app.get('*', (req, res) => {
  var ipInfo = getIP(req);
  console.log(ipInfo);

  let file

  if (/./.test(req.url)) {
    file = `./public${req.url}`
  }

  fs.readFile(file, 'utf8', (error, data) => {
    if (error) {
      res.statusCode = 404;
      res.redirect(`/index.html`)
    } else {
      res.statusCode = 200;
      res.sendFile(`${__dirname}${String(file.replace('.', ''))}`)
    }

  })

})

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