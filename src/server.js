const express = require('express');

const app = express();
const path = require('path');
const server = require('http').createServer(app);
const socketio = require('socket.io');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

app.use('/assets', express.static(path.resolve(`${__dirname}/../public/`)));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../client/index.html`));
});

app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../client/styles.css`));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../client/script.js`));
});

server.listen(process.env.PORT || 3000);


console.log(`Listening on 127.0.0.1: ${PORT}`);

const io = socketio(server);
const users = {};
let playerList = [];
const audienceList = [];
let indexDrawer = 0;
let namePlayer1;
let namePlayer2;
let player1B = [];
let player2B = [];
let player1OtherGuesses = [];
let player2OtherGuesses = [];
// to store chat log, so that new users can get updated on ongoing conversation
const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
    const joinMsg = {
      name: 'server',
      msg: `There are ${Object.keys(users).length} users online`,
    };
    /*
    if there is currently a conversation in the chat room,
    update the chat log of the client that has entered since the conversation started
    */

    socket.name = data.name;
    users[socket.name] = socket.name;

    socket.join('room1');
    socket.emit('msg', joinMsg);
    const response = {
      name: 'server',
      msg: `${data.name} has joined the room.`,
    };
    // create object with user info to be stored in queue of drawers
    // need socket.id to send personal info to specific user when chosen
    // to be a drawer, or guessed correctly
    const obj = { id: socket.id, name: socket.name };
    // add user to player gueue, can only be 2
    if (playerList.length < 2) {
      playerList.push(obj);
      // everyone else will be spectators
    } else {
      audienceList.push(obj);
      if (player1B.length > 0 || player2B.length > 0) {
        socket.emit('audienceSetUp', { namePlayer1, namePlayer2, audience: true, player1B, player2B, player1OtherGuesses, player2OtherGuesses });
      } else {
        socket.emit('audienceSetUp', { namePlayer1, namePlayer2, audience: true });
      }
    }
    // first person to joing server will guess first
    if (Object.keys(users).length === 1) {
      namePlayer1 = socket.name;
    }
    if (Object.keys(users).length === 2) {
      namePlayer2 = playerList[1].name;
      io.sockets.emit('setup', { namePlayer1, namePlayer2 });
      io.to(playerList[0].id).emit('updateTurn', true);
      io.to(playerList[1].id).emit('updateTurn', false);
    }
    socket.broadcast.to('room1').emit('msg', response);
    console.log(`${data.name} joined`);
    socket.emit('msg', { name: 'server', msg: 'You joined the room' });
    // message from server to client that the person has joined the room
  });
};

// is called when the round is over, prompt change of guesser
const nextRound = (sock) => {
  const socket = sock;
  socket.on('roundOver', () => {
    io.to(playerList[indexDrawer].id).emit('updateTurn', false);
    // jump to next in queue
    indexDrawer++;
    // unless we hit last index, then start over
    if (indexDrawer === playerList.length) {
      indexDrawer = 0;
    }
    // tell next client it's his turn
    io.to(playerList[indexDrawer].id).emit('updateTurn', true);
  });
};

// sends drawing info back and forth
const onDrawer = (sock) => {
  const socket = sock;
  // when the player clicks
  // a guess is sent to the other player, checking if there is a hit
  socket.on('guess', (data) => {
    socket.broadcast.emit('guess', data);
  });
  // a check of bool true/false is sent back to the player that clicked
  socket.on('check', (data) => {
    socket.broadcast.emit('check', data);
  });
  // clear canvas of all
  socket.on('clearCanvas', () => {
    io.sockets.emit('clearCanvas');
  });
  socket.on('sendBoard', (data) => {
    if (data.user === namePlayer1) {
      player1B = []; 
      player1OtherGuesses = [];
      for (let i = 0; i < data.ships.length; i++) {
        player1B.push(data.ships[i]);
      }
      for (let i = 0; i < data.otherGuesses.length; i++) {
        player1OtherGuesses.push(data.otherGuesses[i]);
      }
    } else if (data.user === namePlayer2) {
      player2B = [];
      player2OtherGuesses = [];
      for (let i = 0; i < data.ships.length; i++) {
        player2B.push(data.ships[i]);
      }  
      for (let i = 0; i < data.otherGuesses.length; i++) {
        player2OtherGuesses.push(data.otherGuesses[i]);
      }
    }
    for (let i = 0; i < audienceList.length; i++) {
      io.to(audienceList[i].id).emit('sendBoard', data);
    }
  });
};

const onDisconnect = (sock) => {
  const socket = sock;
  socket.on('disconnect', (data) => {
    console.dir(data);
    const message = `${socket.name} has left the room.`;
    socket.broadcast.to('room1').emit('msg', { name: 'server', msg: message });
    // tell the chat when the client leaves the room
    socket.leave('room1');
    // check which object in the list that contains the name of the client
    // that is leaving, then take it out from queue
    for (let i = 0; i < playerList.length; i++) {
      if (playerList[i].name === socket.name) {
        playerList.splice(i, 1);
        break;
      }
    }
    delete users[socket.name];
  });
  // if no users connected anymore, just clean some things up from server
  if (Object.keys(users).length === 0) {
    playerList = [];
  }
};

io.sockets.on('connection', (socket) => {
  console.log('started');
  onJoined(socket);
  onDisconnect(socket);
  onDrawer(socket);
  nextRound(socket);
});

console.log('Websocket server started');
