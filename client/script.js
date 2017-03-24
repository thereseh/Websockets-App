"use strict"

  let ctx, canvas, serverCtx, serverCanvas;
  let user, player1, player2;
  let socket;
  let playing = false;
  let placing = true;
  let audience = false;
  let myGuesses = [], otherGuesses = [];
  let ship1 = {
    parts:[
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue' },
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue' }
    ],
    destroyed:false, 
    placing:false, 
    vert:false, 
    placed:false
  };
  let ship2 = { 
    parts:[
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue'},
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue'},
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue'}
    ],
    destroyed:false,
    placing:false,
    vert:false,
    placed:false
  };
  let ship3 = { 
    parts:[
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue'},
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue'},
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue'},
      { x: 0, y: 0, w: 35, h: 35, hit:false, color: 'blue'}
    ],
    destroyed:false,
    placing:false,
    vert:false,
    placed:false
  };
  const ships = [ship1, ship2, ship3];
  let audienceP1 = [];
  let audienceP2 = [];
  let player1Attacks = [];
  let player2Attacks = [];


 // ====== NON SERVER METHODS ====== //

// the drawing method for when user is trying to place ships
// keypress of "R" will allow for rotation of boats
  const draw = (pos) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    displayGrid();
    ctx.fillStyle = 'blue';
    let x = Math.floor(pos.x/35)*35;
    let y = Math.floor(pos.y/35)*35;
    
    if (placing) {
    if (ship1.placing) {
      if (ship1.vert) {
        if (x >= canvas.width) {
          ctx.fillRect(canvas.width-35,y,35,35);
          ctx.fillRect(canvas.width-35,y+35,35,35);
        } else if (x < 0) {
          ctx.fillRect(0,y,35,35);
          ctx.fillRect(0,y+35,35,35);
        } else if (y+35 >= canvas.height) {
          ctx.fillRect(x,canvas.height-70,35,35);
          ctx.fillRect(x,canvas.height-35,35,35);
        } else if(y < 0) {
          ctx.fillRect(x,0,35,35);
          ctx.fillRect(x,35,35,35);
        } else {
          ctx.fillRect(x,y,35,35);
          ctx.fillRect(x,y+35,35,35);
        }
      } else {
          if (x+35 >= canvas.width) {
              ctx.fillRect(canvas.width-70,y,35,35);
              ctx.fillRect(canvas.width-35,y,35,35);
            } else if (x < 0) {
              ctx.fillRect(0,y,35,35);
              ctx.fillRect(35,y,35,35);
            } else if(y >= canvas.height) {
              ctx.fillRect(x,canvas.height-35,35,35);
              ctx.fillRect(x+35,canvas.height-35,35,35);
            } else if(y < 0) {
              ctx.fillRect(x,0,35,35);
              ctx.fillRect(x+35,0,35,35);
            } else {
              ctx.fillRect(x,y,35,35);
              ctx.fillRect(x+35,y,35,35);
            }
        }
    }
    if (ship2.placing) {
      if (ship2.vert) {
        if (x >= canvas.width) {
          ctx.fillRect(canvas.width-35,y,35,35);
          ctx.fillRect(canvas.width-35,y+35,35,35);
          ctx.fillRect(canvas.width-35,y+70,35,35);
        } else if (x < 0) {
          ctx.fillRect(0,y,35,35);
          ctx.fillRect(0,y+35,35,35);
          ctx.fillRect(0,y+70,35,35);
        } else if(y+70 >= canvas.height) {
          ctx.fillRect(x,canvas.height-105,35,35);
          ctx.fillRect(x,canvas.height-70,35,35);
          ctx.fillRect(x,canvas.height-35,35,35); 
        } else if(y < 0) {
          ctx.fillRect(x,0,35,35);
          ctx.fillRect(x,35,35,35);
          ctx.fillRect(x,70,35,35);
        } else {
          ctx.fillRect(x,y,35,35);
          ctx.fillRect(x,y+35,35,35);
          ctx.fillRect(x,y+70,35,35);
        }
      } else {
        if (x+70 >= canvas.width) {
            ctx.fillRect(canvas.width-105,y,35,35);
            ctx.fillRect(canvas.width-70,y,35,35);
            ctx.fillRect(canvas.width-35,y,35,35);
          } else if (x < 0) {
            ctx.fillRect(0,y,35,35);
            ctx.fillRect(35,y,35,35);
            ctx.fillRect(70,y,35,35);
          } else if(y >= canvas.height) {
            ctx.fillRect(x,canvas.height-35,35,35);
            ctx.fillRect(x+35,canvas.height-35,35,35);
            ctx.fillRect(x+70,canvas.height-35,35,35);
          } else if (y < 0) {
            ctx.fillRect(x,0,35,35);
            ctx.fillRect(x+35,0,35,35);
            ctx.fillRect(x+70,0,35,35);
          } else {
            ctx.fillRect(x,y,35,35);
            ctx.fillRect(x+35,y,35,35);
            ctx.fillRect(x+70,y,35,35);
          }
      }
    }
    if (ship3.placing) {
      if (ship3.vert) {
        if (x >= canvas.width) {
          ctx.fillRect(canvas.width-35,y,35,35);
          ctx.fillRect(canvas.width-35,y+35,35,35);
          ctx.fillRect(canvas.width-35,y+70,35,35);
          ctx.fillRect(canvas.width-35,y+105,35,35);
        } else if (x < 0) {
          ctx.fillRect(0,y,35,35);
          ctx.fillRect(0,y+35,35,35);
          ctx.fillRect(0,y+70,35,35);
          ctx.fillRect(0,y+105,35,35);
        } else if (y+105 >= canvas.height) {
          ctx.fillRect(x,canvas.height-140,35,35);
          ctx.fillRect(x,canvas.height-105,35,35);
          ctx.fillRect(x,canvas.height-70,35,35);
          ctx.fillRect(x,canvas.height-35,35,35); 
        } else if (y < 0) {
          ctx.fillRect(x,0,35,35);
          ctx.fillRect(x,35,35,35);
          ctx.fillRect(x,70,35,35);
          ctx.fillRect(x,105,35,35);
        } else {
          ctx.fillRect(x,y,35,35);
          ctx.fillRect(x,y+35,35,35);
          ctx.fillRect(x,y+70,35,35);
          ctx.fillRect(x,y+105,35,35);
          }
      } else {
        if (x+105 >= canvas.width) {
            ctx.fillRect(canvas.width-140,y,35,35);
            ctx.fillRect(canvas.width-105,y,35,35);
            ctx.fillRect(canvas.width-70,y,35,35);
            ctx.fillRect(canvas.width-35,y,35,35);
          } else if (x < 0) {
            ctx.fillRect(0,y,35,35);
            ctx.fillRect(35,y,35,35);
            ctx.fillRect(70,y,35,35);
            ctx.fillRect(105,y,35,35);
          } else if(y >= canvas.height) {
            ctx.fillRect(x,canvas.height-35,35,35);
            ctx.fillRect(x+35,canvas.height-35,35,35);
            ctx.fillRect(x+70,canvas.height-35,35,35);
            ctx.fillRect(x+105,canvas.height-35,35,35);
          } else if(y < 0) {
            ctx.fillRect(x,0,35,35);
            ctx.fillRect(x+35,0,35,35);
            ctx.fillRect(x+70,0,35,35);
            ctx.fillRect(x+105,0,35,35);
          } else {
            ctx.fillRect(x,y,35,35);
            ctx.fillRect(x+35,y,35,35);
            ctx.fillRect(x+70,y,35,35);
            ctx.fillRect(x+105,y,35,35);
          }
      }
    }  
    //draws placed boats
     for (let i = 0; i < ships.length; i++) {
        if (ships[i].placed) {
          for (let j = 0; j < ships[i].parts.length; j++) {
            ctx.fillRect(ships[i].parts[j].x, ships[i].parts[j].y, ships[i].parts[j].w, ships[i].parts[j].h);
          }
        }
      }
    }
  };

const checkDestroy = () => {
  for (let i = 0; i < ships.length; i++) {
    let numParts = ships[i].parts.length;
    let numHit = 0;
    if (ships[i].placed) {
      for (let j = 0; j < numParts; j++) { 
        if (ships[i].parts[j].hit) {
          numHit++;
        }
      }
      if (numHit === numParts) {
        ships[i].destroyed = true;
      }
    }
  }
};

// drawing method for when the game is happening
// it draws differently depending on if the cient is a player or an audience
  const drawHit = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    serverCtx.clearRect(0, 0, serverCtx.canvas.width, serverCtx.canvas.height);
    displayGrid();
    
    // if a player
    if(!audience) {
      // re-draws the players own ship
      for (let i = 0; i < ships.length; i++) {
        if (ships[i].placed) {
          for (let j = 0; j < ships[i].parts.length; j++) { 
            ctx.fillStyle = ships[i].parts[j].color;
            ctx.fillRect(ships[i].parts[j].x, ships[i].parts[j].y, ships[i].parts[j].w, ships[i].parts[j].h);
          }
        }
      }
      
      checkDestroy();
      
      // draws the click of this player
      // green for hit, red for miss
      for(let i = 0; i < myGuesses.length; i++) {
        serverCtx.fillStyle = myGuesses[i].color;
        serverCtx.fillRect(myGuesses[i].x, myGuesses[i].y, myGuesses[i].w, myGuesses[i].h);
      }
      
      for(let i = 0; i < otherGuesses.length; i++) {
        ctx.fillStyle = otherGuesses[i].color;
        ctx.fillRect(otherGuesses[i].x, otherGuesses[i].y, otherGuesses[i].w, otherGuesses[i].h);
      }
      // if audience
      } else {
      // ships for player1
      for (let i = 0; i < audienceP1.length; i++) {
        if (audienceP1[i].placed) {
          for (let j = 0; j < audienceP1[i].parts.length; j++) {
            ctx.fillStyle = audienceP1[i].parts[j].color;
            ctx.fillRect(audienceP1[i].parts[j].x, audienceP1[i].parts[j].y, audienceP1[i].parts[j].w, audienceP1[i].parts[j].h);
          }
        }
        // draws attacks that has been made on player1
        for(let i = 0; i < player1Attacks.length; i++) {
          ctx.fillStyle = player1Attacks[i].color;
          ctx.fillRect(player1Attacks[i].x, player1Attacks[i].y, player1Attacks[i].w, player1Attacks[i].h);
        }
      }
        
      // ships for player2
      for (let i = 0; i < audienceP2.length; i++) {
        if (audienceP2[i].placed) {
          for (let j = 0; j < audienceP2[i].parts.length; j++) {
            serverCtx.fillStyle = audienceP2[i].parts[j].color;
            serverCtx.fillRect(audienceP2[i].parts[j].x, audienceP2[i].parts[j].y, audienceP2[i].parts[j].w, audienceP2[i].parts[j].h);
          }
        }
        
        // draws attacks that has been made on player2
        for(let i = 0; i < player2Attacks.length; i++) {
          serverCtx.fillStyle = player2Attacks[i].color;
          serverCtx.fillRect(player2Attacks[i].x, player2Attacks[i].y, player2Attacks[i].w, player2Attacks[i].h);
        }
      }
    }
  };

  // checks if player is pressing the "R" key for rotation
  const checkKeyPress = (e) => {    
    if (e.keyCode == "82") {
      if (ship1.placing) ship1.vert = !ship1.vert;
      if (ship2.placing) ship2.vert = !ship2.vert;
      if (ship3.placing) ship3.vert = !ship3.vert;
    }
  };

  // method to get mouse position on canvas
  const getMousePos = (e, can) => {
    let rect = can.getBoundingClientRect();
          
  // get more accurate position on canvas
    let position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    return position;
  };


// creates the grid on the canvases
 const displayGrid = () => {
   let height = canvas.height;
   let width = canvas.width;
   ctx.strokeStyle = "darkgray";
   serverCtx.strokeStyle = "darkgray";
   ctx.lineWidth = 1;
   serverCtx.lineWidth = 1;
   for (let i = 0; i < height; i += 35) {
     ctx.moveTo(0, i);
     ctx.lineTo(width, i);
     ctx.stroke();
     serverCtx.moveTo(0, i);
     serverCtx.lineTo(width, i);
     serverCtx.stroke();
   }
   for (let i = 0; i < width; i += 35) {
     ctx.moveTo(i, 0);
     ctx.lineTo(i, height);
     ctx.stroke();
     serverCtx.moveTo(i, 0);
     serverCtx.lineTo(i, height);
     serverCtx.stroke();
  }
 };

  // changes the layout when a player is don placing their ships on the board
  const beginGame = () => {
    document.querySelector("#indexh1").style.display = "none";
    document.querySelector("#indexh3").style.display = "none";
    document.querySelector("#serverCanvas").style.display = "inline-block";
    document.querySelector("#you").style.display = "inline-block";
    document.querySelector("#opponent").style.display = "inline-block";
    document.querySelector("#btn4").style.display = "none";
    document.querySelector("#ships").style.display = "none";
    document.querySelector("#player1List").style.display = "inline-block";
    document.querySelector("#player2List").style.display = "inline-block";
  };

  // updates in the beginning
  const updateUserLabel = () => {
    document.querySelector("#indexh1").innerHTML = "Welcome " + user;
    document.querySelector("#indexh1").innerHTML += "<br>Place your ships";
    document.querySelector("#indexh3").innerHTML += "Press 'R' to rotate";

  };



// ====== SOCKET SERVER CODE =======



  const connectSocket = (e) => {
  document.querySelector("#inputUser").style.display = "none";
  document.querySelector("#ships").style.display = "inline-block";

  canvas.style.display = "inline-block";
  displayGrid();
  socket = io.connect(); 
    
    socket.on('connect', () => { 
    user = document.querySelector("#username").value;
      
      if (!user) {
        user = 'unknown';
      }
      
      updateUserLabel(); 
      socket.emit('join', { name: user });
    });
    
  socket.on('msg', (data) => {
    console.log(data);
  });
    
  // set up if an audience
  socket.on('audienceSetUp', (data) => {
    // get the name of the players
    player1 = data.namePlayer1;
    player2 = data.namePlayer2;
    // set to true
    audience = data.audience;
    // not placing stuff
    placing = false;
    
    // if an audience joins after game already begin, there is more
    // to be set up
    if (data.player1B) {
      console.log("player1 ships: ");
      console.dir(data.player1B);
      for (let i = 0; i < data.player1B.length; i++) {
        audienceP1.push(data.player1B[i]);
      }
      console.log("player2 ships: ");
      console.dir(data.player2B);
      for (let i = 0; i < data.player2B.length; i++) {
        audienceP2.push(data.player2B[i]);
      }
      console.log("player1 attacks: ");
      console.dir(data.player1OtherGuesses);
      if (data.player1OtherGuesses) {
        for (let i = 0; i < data.player1OtherGuesses.length; i++) {
         player1Attacks.push(data.player1OtherGuesses[i]);
      }
      console.log("player2 attacks: ");
      console.dir(data.player2OtherGuesses);
        for (let i = 0; i < data.player2OtherGuesses.length; i++) {
          player2Attacks.push(data.player2OtherGuesses[i]);
        }
      }
      // if waiting for players to get done, display this text
    } else {
        document.querySelector("#guest").style.display = "inline-block";
      }
      beginGame();
      drawHit();
    });

    // set up for players, get the name of each one
    socket.on('setup', (data) => {
      console.dir(data);
      player1 = data.namePlayer1;
      player2 = data.namePlayer2;
    });
    
    // check for button click, when a button is clicked
    // toggle the booleans for drawing
    const btn1 = document.querySelector("#btn1");
    btn1.addEventListener('click', (e) => {
      ship1.placing = true;
      ship2.placing = false;
      ship3.placing = false;
    });
    const btn2 = document.querySelector("#btn2");
    btn2.addEventListener('click', (e) => {
      ship2.placing = true;
      ship1.placing = false;
      ship3.placing = false;
    });
    const btn3 = document.querySelector("#btn3");
    btn3.addEventListener('click', (e) => {
      ship3.placing = true;
      ship1.placing = false;
      ship2.placing = false;
    });
    
    // this begins the game by displaying the other canvas
    const play = document.querySelector("#btn4");
    play.addEventListener('click', (e) => {
      beginGame();
      // tell audience that a player is done placing ships
      socket.emit('sendBoard', { user, ships, otherGuesses, playing });
    });
    
    // toggles turns
    socket.on('updateTurn', (data) => {
      playing = data;
      if (data) {
        // if this user is player1, and it his turn to attach
        if (player1 === user) {
          document.querySelector("#you").innerHTML = player1 + " - Your turn, attack here!";
          document.querySelector("#opponent").innerHTML = player2;
        // if this user is player2
        } else {
          document.querySelector("#you").innerHTML = player2 + " - Your turn, ttack here!";
          document.querySelector("#opponent").innerHTML = player1;
        }
      } else {
        // if this user is player1, and it is not his turn
        if (player1 === user) {
          document.querySelector("#you").innerHTML = player1;
          document.querySelector("#opponent").innerHTML = player2 + " - is making a move";
        // if this user is player2
        } else {
          document.querySelector("#you").innerHTML = player2;
          document.querySelector("#opponent").innerHTML = player1 + " - is making a move";
        }
      }
      // tell audience a switch in turns has been made
      socket.emit('sendBoard', { user, ships, otherGuesses, playing });
    });
    
    // send information to audience
    socket.on('sendBoard', (data) => {
      console.dir(data.otherGuesses);
      // if this user is player1
      if (data.user === player1) {
      // get new info about player1 ships
        audienceP1 = [];
        player1Attacks = [];
        for (let i = 0; i < data.ships.length; i++) {
          audienceP1.push(data.ships[i]);
        }
        // get the attacks that has been made on player1
         for (let i = 0; i < data.otherGuesses; i++) {
          console.dir(data.otherGuesses[i]);
          player1Attacks.push(data.otherGuesses[i]);
        }
        if (data.playing) {
          // update text 
          document.querySelector("#you").innerHTML = player1 + " is making a move";
          document.querySelector("#opponent").innerHTML = player2;
        }
      }
      if (data.user === player2) {
        // get new info about player2 shipts
        audienceP2 = [];
        // new info about attacks
        player2Attacks = [];
        console.dir(data);
        console.log(data.ships.length);
         for (let i = 0; i < data.ships.length; i++) {
          console.dir(data.ships[i]);
          audienceP2.push(data.ships[i]);
        }
        console.dir(data.otherGuesses[i]);
        for (let i = 0; i < data.otherGuesses; i++) {
          console.dir(data.otherGuesses[i]);
           player2Attacks.push(data.otherGuesses[i]);
        }
        // get the attacks that has been made on player2
        console.log(`data.playing ${data.playing}  player2  ${player2}`)
        if (data.playing) {
          document.querySelector("#you").innerHTML = player1;
          document.querySelector("#opponent").innerHTML = player2 + " is making a move";
        }
      }
      drawHit();
    });
    
    // when a check is returned, was either a hit or not
    // draw new square depending on the outcome
    socket.on('check', (data) => {
      console.log("on check");
      console.dir(data.data);
      let x = Math.floor(data.data.myGuessPos.x/35)*35;
      let y = Math.floor(data.data.myGuessPos.y/35)*35;
      if (data.wasHit) {
        myGuesses.push({ x: x, y: y, w: 35, h: 35, color:'green' });
      } else {
        myGuesses.push({ x: x, y: y, w: 35, h: 35, color:'red' });
      }
      socket.emit('roundOver');
      drawHit();
    });
    
    // a guess has been made from other player
    // check if the person hit or not
    // draw square depending on the outcom
    // green for miss, and change color of ship part of hit
    // and return a boolean of true/false
     socket.on('guess', (data) => {
      let x = Math.floor(data.myGuessPos.x/35)*35;
      let y = Math.floor(data.myGuessPos.y/35)*35;
       
      let wasHit = false;
       
       for (let i = 0; i < ships.length; i++) {
          for (let j = 0; j < ships[i].parts.length; j++) {
            if (x === ships[i].parts[j].x && y === ships[i].parts[j].y) {
              ships[i].parts[j].color = 'red';
              ships[i].parts[j].hit = true;
              wasHit = true;
            }
          }
        }
       
     if (!wasHit) {
      otherGuesses.push({ x: x, y: y, w: 35, h: 35, color:'green' });
     }  
       drawHit();
        socket.emit('check', { wasHit, data });
      });
          
    // ====== MOUSE EVENTS =========
    serverCanvas.onmousedown = (e) => {
      // if it's your turn
        if (playing) {
           let myGuessPos = getMousePos(e, serverCanvas);
           socket.emit('guess', { myGuessPos });
        }
      };
    
    canvas.onmousedown = (e) => {
      };
    canvas.onmouseup = (e) => {
        // only care if the person is the drawer
    if (placing) {   
          // get curr mouse position on canva
     let pos = getMousePos(e, canvas);
     // get a more accurate position, grid-vise
     // each square on the grid is w: 35 and h: 35
     let x = Math.floor(pos.x/35)*35;
     let y = Math.floor(pos.y/35)*35;
     
     if (ship1.placing) {
       document.querySelector("#btn1").style.display = "none";
       ship1.placed = true;
       if (ship1.vert) {
         if (x >= canvas.width) {
           ship1.parts[0].x = canvas.width-35;
           ship1.parts[0].y = y;
           ship1.parts[1].x = canvas.width-35;
           ship1.parts[1].y = y+35;
         } else if (x < 0) {
           ship1.parts[0].x = 0;
           ship1.parts[0].y = y;
           ship1.parts[1].x = 0;
           ship1.parts[1].y = y+35;
         } else if (y+35 >= canvas.height) {
           ship1.parts[0].x = x;
           ship1.parts[0].y = canvas.height-70;
           ship1.parts[1].x = x;
           ship1.parts[1].y = canvas.height-35;
         } else if (y < 0) {
           ship1.parts[0].x = x;
           ship1.parts[0].y = 0;
           ship1.parts[1].x = x;
           ship1.parts[1].y = 35;
         } else {
           ship1.parts[0].x = x;
           ship1.parts[0].y = y;
           ship1.parts[1].x = x;
           ship1.parts[1].y = y+35;
         }
       } else {
         if (x+35 >= canvas.width) {
           ship1.parts[0].x = canvas.width-70;
           ship1.parts[0].y = y;
           ship1.parts[1].x = canvas.width-35;
           ship1.parts[1].y = y;
         } else if (x < 0) {
           ship1.parts[0].x = 0;
           ship1.parts[0].y = y;
           ship1.parts[1].x = 35;
           ship1.parts[1].y = y;
         } else if (y >= canvas.height) {
           ship1.parts[0].x = x;
           ship1.parts[0].y = canvas.height-35;
           ship1.parts[1].x = x+35;
           ship1.parts[1].y = canvas.height-35;
         } else if(y < 0) {
           ship1.parts[0].x = x;
           ship1.parts[0].y = 0;
           ship1.parts[1].x = x+35;
           ship1.parts[1].y = 0;
         } else {
           ship1.parts[0].x = x;
           ship1.parts[0].y = y;
           ship1.parts[1].x = x+35;
           ship1.parts[1].y = y;
         }
       }
       ship1.placing = false;
      } // end ship1
      if (ship2.placing) {
        ship2.placed = true;
        document.querySelector("#btn2").style.display = "none";
        if (ship2.vert) {
          if (x >= canvas.width) {
            ship2.parts[0].x = canvas.width-35;
            ship2.parts[0].y = y;
            ship2.parts[1].x = canvas.width-35;
            ship2.parts[1].y = y+35;
            ship2.parts[2].x = canvas.width-35;
            ship2.parts[2].y = y+70;
          } else if (x < 0) {
            ship2.parts[0].x = 0;
            ship2.parts[0].y = y;
            ship2.parts[1].x = 0;
            ship2.parts[1].y = y+35;
            ship2.parts[2].x = 0;
            ship2.parts[2].y = y+70;
          } else if (y+70 >= canvas.height) {
            ship2.parts[0].x = x;
            ship2.parts[0].y = canvas.height-105;
            ship2.parts[1].x = x;
            ship2.parts[1].y = canvas.height-70;
            ship2.parts[2].x = x;
            ship2.parts[2].y = canvas.height-35;
          } else if (y < 0) {
            ship2.parts[0].x = x;
            ship2.parts[0].y = 0;
            ship2.parts[1].x = x;
            ship2.parts[1].y = 35;
            ship2.parts[2].x = x;
            ship2.parts[2].y = 70;
          } else {
           ship2.parts[0].x = x;
           ship2.parts[0].y = y;
           ship2.parts[1].x = x;
           ship2.parts[1].y = y+35;
           ship2.parts[2].x = x;
           ship2.parts[2].y = y+70;
         }
        } else {
          if (x+70 >= canvas.width) {
            ship2.parts[0].x = canvas.width-105;
            ship2.parts[0].y = y;
            ship2.parts[1].x = canvas.width-70;
            ship2.parts[1].y = y;
            ship2.parts[2].x = canvas.width-35;
            ship2.parts[2].y = y;
          } else if (x < 0) {
            ship2.parts[0].x = 0;
            ship2.parts[0].y = y;
            ship2.parts[1].x = 35;
            ship2.parts[1].y = y;
            ship2.parts[2].x = 70;
            ship2.parts[2].y = y;
          } else if(y >= canvas.height) {
            ship2.parts[0].x = x;
            ship2.parts[0].y = canvas.height-35;
            ship2.parts[1].x = x+35;
            ship2.parts[1].y = canvas.height-35;
            ship2.parts[2].x = x+70;
            ship2.parts[2].y = canvas.height-35;
          } else if (y < 0) {
            ship2.parts[0].x = x;
            ship2.parts[0].y = canvas.height-35;
            ship2.parts[1].x = x+35;
            ship2.parts[1].y = canvas.height-35;
            ship2.parts[2].x = x+70;
            ship2.parts[2].y = canvas.height-35;
          } else {
            ship2.parts[0].x = x;
            ship2.parts[0].y = y;
            ship2.parts[1].x = x+35;
            ship2.parts[1].y = y;
            ship2.parts[2].x = x+70;
            ship2.parts[2].y = y;
          }
        }
        ship2.placing = false;
      } // end ship2 
      if (ship3.placing) {
        ship3.placed = true;
        document.querySelector("#btn3").style.display = "none";
        if (ship3.vert) {
          if (x >= canvas.width) {
            ship3.parts[0].x = canvas.width-35;
            ship3.parts[0].y = y;
            ship3.parts[1].x = canvas.width-35;
            ship3.parts[1].y = y;
            ship3.parts[2].x = canvas.width-35;
            ship3.parts[2].y = y;
            ship3.parts[3].x = canvas.width-35;
            ship3.parts[3].y = y;
          } else if (x < 0) {
            ship3.parts[0].x = 0;
            ship3.parts[0].y = y;
            ship3.parts[1].x = 0;
            ship3.parts[1].y = y+35;
            ship3.parts[2].x = 0;
            ship3.parts[2].y = y+70;
            ship3.parts[3].x = 0;
            ship3.parts[3].y = y+105;
          } else if (y+105 >= canvas.height) {
            ship3.parts[0].x = x;
            ship3.parts[0].y = canvas.height-140;
            ship3.parts[1].x = x;
            ship3.parts[1].y = canvas.height-105;
            ship3.parts[2].x = x;
            ship3.parts[2].y = canvas.height-70;
            ship3.parts[3].x = x;
            ship3.parts[3].y = canvas.height-35;
          } else if(y < 0) {
            ship3.parts[0].x = x;
            ship3.parts[0].y = 0;
            ship3.parts[1].x = x;
            ship3.parts[1].y = 35;
            ship3.parts[2].x = x;
            ship3.parts[2].y = 70;
            ship3.parts[3].x = x;
            ship3.parts[3].y = 105;
          } else {
            ship3.parts[0].x = x;
            ship3.parts[0].y = y;
            ship3.parts[1].x = x;
            ship3.parts[1].y = y+35;
            ship3.parts[2].x = x;
            ship3.parts[2].y = y+70;
            ship3.parts[3].x = x;
            ship3.parts[3].y = y+105;
          }
        } else {
          if (x+105 >= canvas.width) {
            ship3.parts[0].x = canvas.width-140;
            ship3.parts[0].y = y;
            ship3.parts[1].x = canvas.width-105;
            ship3.parts[1].y = y;
            ship3.parts[2].x = canvas.width-70;
            ship3.parts[2].y = y;
            ship3.parts[3].x = canvas.width-35;
            ship3.parts[3].y = y;
          } else if (x < 0) {
            ship3.parts[0].x = 0;
            ship3.parts[0].y = y;
            ship3.parts[1].x = 35;
            ship3.parts[1].y = y;
            ship3.parts[2].x = 70;
            ship3.parts[2].y = y;
            ship3.parts[3].x = 105;
            ship3.parts[3].y = y; 
          } else if (y >= canvas.height) {
            ship3.parts[0].x = x;
            ship3.parts[0].y = canvas.height-35;
            ship3.parts[1].x = x+35;
            ship3.parts[1].y = canvas.height-35;
            ship3.parts[2].x = x+70;
            ship3.parts[2].y = canvas.height-35;
            ship3.parts[3].x = x+105;
            ship3.parts[3].y = canvas.height-35; 
          } else if (y < 0) {
            ship3.parts[0].x = x;
            ship3.parts[0].y = 0;
            ship3.parts[1].x = x+35;
            ship3.parts[1].y = 0;
            ship3.parts[2].x = x+70;
            ship3.parts[2].y = 0;
            ship3.parts[3].x = x+105;
            ship3.parts[3].y = 0; 
          } else {
            ship3.parts[0].x = x;
            ship3.parts[0].y = y;
            ship3.parts[1].x = x+35;
            ship3.parts[1].y = y;
            ship3.parts[2].x = x+70;
            ship3.parts[2].y = y;
            ship3.parts[3].x = x+105;
            ship3.parts[3].y = y;
          }
        }
          ship3.placing = false;
      } // end ship3      
    }
      if (ship1.placed && ship2.placed && ship3.placed) {
        document.querySelector("#btn4").style.display = "inline-block";
      };
    };

      canvas.onmousemove = (e) => {
        // if you are currently holding down the mouse, and you are the drawer
        // then I care
        if (placing) {    
          // send these lines to server, to be drawn on the 
          // guessers canvas, broadcasted to all except the drawer
          // draw self
          draw(getMousePos(e, canvas));
        }
      };
    
    // if you guessed correct, you get point
    // and the round is over, prompting the change of drawer
  };

  const init = () => {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    serverCanvas = document.querySelector("#serverCanvas");
    serverCtx = serverCanvas.getContext("2d");
    const connect = document.querySelector("#connect");
    connect.addEventListener('click', () => {
      console.log('connect');
      connectSocket();
    });  
  };
window.onload = init;

window.addEventListener("keyup", checkKeyPress, false);