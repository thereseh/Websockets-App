"use strict"

  let ctx, canvas, serverCtx, serverCanvas;
  let user;
  let linesToDraw = [];
  let btn1 = false, btn2 = false, btn3 = false;
  let socket;
  let playing = false;
  let placing = true;
  let myGuessPos;
  let ships = [];
  let myGuesses = [], otherGuesses = [];
  let b1 = false, b2 = false, b3 = false;


 // ====== NON SERVER METHODS ====== //

// the drawing method for when user is trying to place ships
// will add soon so player can change direction of ships
// must find a more efficient way for this
  const draw = (pos) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    displayGrid();
    ctx.fillStyle = 'blue';
    if (placing) {
       let x = Math.floor(pos.x/35)*35;
       let y = Math.floor(pos.y/35)*35;
      
      if (x+10)
      if (b1) {
        if (x+35 <= (canvas.width-35)) {
        ctx.fillRect(x,y,35,35);
        ctx.fillRect(x+35,y,35,35);
      } else if (x < 0) {
        ctx.fillRect(0,y,35,35);
        ctx.fillRect(35,y,35,35);
      } else {
        ctx.fillRect(canvas.width-70,y,35,35);
        ctx.fillRect(canvas.width-35,y,35,35);
      }
      } else if (b2) {
        if (x+70 <= (canvas.width-35)) {
        ctx.fillRect(x,y,35,35);
        ctx.fillRect(x+35,y,35,35);
        ctx.fillRect(x+70,y,35,35);
        } else if (x < 0) {
        ctx.fillRect(0,y,35,35);
        ctx.fillRect(35,y,35,35);
        ctx.fillRect(70,y,35,35);
        } else {
        ctx.fillRect(canvas.width-105,y,35,35);
        ctx.fillRect(canvas.width-70,y,35,35);
        ctx.fillRect(canvas.width-35,y,35,35);
        }
       
      } else if (b3) {
        if (x+35 <= (canvas.width-35)) {
        ctx.fillRect(x,y,35,35);
        ctx.fillRect(x+35,y,35,35);
        ctx.fillRect(x+70,y,35,35);
        ctx.fillRect(x+105,y,35,35);
      } else if (x < 0) {
        ctx.fillRect(0,y,35,35);
        ctx.fillRect(35,y,35,35);
        ctx.fillRect(70,y,35,35);
         ctx.fillRect(105,y,35,35);
      } else {
        ctx.fillRect(canvas.width-140,y,35,35);
         ctx.fillRect(canvas.width-105,y,35,35);
        ctx.fillRect(canvas.width-70,y,35,35);
        ctx.fillRect(canvas.width-35,y,35,35);
      }
      } 
        for(let i = 0; i < ships.length; i++) {
          ctx.fillRect(ships[i].x,ships[i].y,ships[i].w,ships[i].h);
        }
        
    }
  };

// drawing method for when the game is happening
  const drawHit = () => {
    console.log('drawHit');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    displayGrid();
    ctx.fillStyle = 'blue';
    
    // re-draws the players own ship
    for(let i = 0; i < ships.length; i++) {
      ctx.fillRect(ships[i].x,ships[i].y,ships[i].w,ships[i].h);
    }
    
    // draws the clicks of the other player
    for(let i = 0; i < otherGuesses.length; i++) {
      ctx.fillStyle = otherGuesses[i].color;
      console.dir(otherGuesses);
      ctx.fillRect(otherGuesses[i].x, otherGuesses[i].y, otherGuesses[i].w, otherGuesses[i].h);
    }
    
    // draws the click of this player
    for(let i = 0; i < myGuesses.length; i++) {
      console.dir(myGuesses);
      serverCtx.fillStyle = myGuesses[i].color;
      serverCtx.fillRect(myGuesses[i].x, myGuesses[i].y, myGuesses[i].w, myGuesses[i].h);
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

  // depending on which button that's clicked
  // to know how many squares to tempoaraly draw
  const drawShip = (num) => {
    if (num === 1) {
      b1 = true;
      b2 = false;
      b3 = false;
    } else if (num === 2) {
      b2 = true;
      b1 = false;
      b3 = false;
    } else if (num === 3) {
      b3 = true;
      b1 = false;
      b2 = false;
    }
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

// clears canvas when the drawer prompts it
 const clearCanvas = () => {
    linesToDraw = [];
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const updateUserLabel = () => {
    document.querySelector("#indexh1").innerHTML = "Welcome " + user;
    document.querySelector("#indexh1").innerHTML += "<br>Place your ships";
  };

// ====== SOCKET SERVER CODE =======

  const connectSocket = (e) => {
  document.querySelector("#inputUser").style.display = "none";
  document.querySelector("#ships").style.display = "inline-block";;

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
    
      // if user joins later
      socket.on('updateCanvas', (data) => {
        
      });
    });
    
  socket.on('msg', (data) => {
    console.log(data);
  });

  // upates who is gonna draw next, either retuns true or false
  // if this client is not a drawer, then hide the clear button
  // and change text above canvas
  socket.on('updateDrawer', (msg) => {
  });
    
    // clears the canvas of the guessers, as prompted by the drawer
    socket.on('clearCanvas', () => {
    clearCanvas();
  });
    
    // check for button click, when a button is clicked
    // toggle the booleans for drawing
    const ship1 = document.querySelector("#btn1");
    ship1.addEventListener('click', (e) => {
      drawShip(1);
    });
    const ship2 = document.querySelector("#btn2");
    ship2.addEventListener('click', (e) => {
      drawShip(2);
    });
    const ship3 = document.querySelector("#btn3");
    ship3.addEventListener('click', (e) => {
    drawShip(3);
    });
    
    // this begins the game by displaying the other canvas
    const play = document.querySelector("#btn4");
    play.addEventListener('click', (e) => {
      document.querySelector("#serverCanvas").style.display = "inline-block";
      document.querySelector("#you").style.display = "inline-block";
      document.querySelector("#opponent").style.display = "inline-block";
      document.querySelector("#btn4").style.display = "none";
    });
    
    // toggles turns
    socket.on('updateTurn', (data) => {
      playing = data;
      if (data) {
        document.querySelector("#you").innerHTML = "Your turn!";
        document.querySelector("#opponent").innerHTML = "";
      } else {
        document.querySelector("#you").innerHTML = "";
        document.querySelector("#opponent").innerHTML = "Opponents turn";
      }
    });
    
    // when a check is returned, was either a hit or not
    // draw new square depending on the outcome
    socket.on('check', (data) => {
      let x = Math.floor(myGuessPos.x/35)*35;
      let y = Math.floor(myGuessPos.y/35)*35;
       if (data.hit) {
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
    // and return a boolean of true/false
     socket.on('guess', (data) => {
        let x = Math.floor(data.myGuessPos.x/35)*35;
        let y = Math.floor(data.myGuessPos.y/35)*35;
        let hit = false;
       
        for(let i = 0; i < ships.length; i++) {
          if (x === ships[i].x && y === ships[i].y) {
            hit = true;
            break;
          } 
        }
       if (hit) {
          otherGuesses.push({ x: x, y: y, w: 35, h: 35, color:'green' });
       } else {
         otherGuesses.push({ x: x, y: y, w: 35, h: 35, color:'red' });
       }
        
       drawHit();
        socket.emit('check', { hit });
      });
          
    // ====== MOUSE EVENTS =========
    serverCanvas.onmousedown = (e) => {
      // if it's your turn
        if (playing) {
           myGuessPos = getMousePos(e, serverCanvas);
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
          
            // make sure you are within the canvas
            // all other checks is temporary, much find a better more efficient way to do check
            // to make sure the squares making up the ships are staying within the canvas
            if (y <= canvas.height && y= > 0) {
           if (b1) {  
             let f1;
             let f2;
            if (x+35 <= (canvas.width-35)) {
              f1 = { x: x, y: y, w: 35, h: 35 };
              f2 = { x: (x+35),y: y, w: 35, h: 35 };
            } else if (x < 0) {
              f1 = { x: 0, y: y, w: 35, h: 35 };
              f2 = { x: 35,y: y, w: 35, h: 35 };
            } else {
              f1 = { x: canvas.width-70, y: y, w: 35, h: 35 };
              f2 = { x: canvas.width-35,y: y, w: 35, h: 35 };
            }
             ships.push(f1);
             ships.push(f2);
              b1 = false;
             btn1 = true;
              document.querySelector("#btn1").style.display = "none";
           } else if (b2) {
             let s1;
             let s2;
             let s3;
              if (x+70 <= (canvas.width-35)) {
                s1 = { x: x, y: y, w: 35, h: 35 };
                s2 = { x: (x+35),y: y, w: 35, h: 35 };
                s3 = { x: (x+70),y: y, w: 35, h: 35 };
            } else if (x < 0) {
                s1 = { x: 0, y: y, w: 35, h: 35 };
                s2 = { x: 35,y: y, w: 35, h: 35 };
                s3 = { x: 70,y: y, w: 35, h: 35 };
            } else {
                s1 = { x: canvas.width-105, y: y, w: 35, h: 35 };
                s2 = { x: canvas.width-70,y: y, w: 35, h: 35 };
                s3 = { x: canvas.width-35,y: y, w: 35, h: 35 };
            }
              ships.push(s1);
              ships.push(s2);
              ships.push(s3);
              b2 = false;
              btn2 = true;
              document.querySelector("#btn2").style.display = "none";
           } else if (b3) {
             let t1;
             let t2;
             let t3;
             let t4;
             if (x+105 <= (canvas.width-35)) {
              t1 = { x: x, y: y, w: 35, h: 35 };
              t2 = { x: (x+35),y: y, w: 35, h: 35 };
              t3 = { x: (x+70),y: y, w: 35, h: 35 };
              t4 = { x: (x+105),y: y, w: 35, h: 35 };
            } else if (x < 0) {
              t1 = { x: 0, y: y, w: 35, h: 35 };
              t2 = { x: 35,y: y, w: 35, h: 35 };
              t3 = { x: 70,y: y, w: 35, h: 35 };
              t4 = { x: 105,y: y, w: 35, h: 35 };
            } else {
              t1 = { x: canvas.width-140,y: y, w: 35, h: 35 };
              t2 = { x: canvas.width-105, y: y, w: 35, h: 35 };
              t3 = { x: canvas.width-70,y: y, w: 35, h: 35 };
              t4 = { x: canvas.width-35,y: y, w: 35, h: 35 };
            }
             ships.push(t1);
             ships.push(t2);
             ships.push(t3);
             ships.push(t4);
            b3 = false;
            btn3 = true;
            document.querySelector("#btn3").style.display = "none";
           }
            }
          if (btn1 && btn2 && btn3) {
            document.querySelector("#btn4").style.display = "inline-block";
          };
        }
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
      connectSocket();
    });
  }; 

  window.onload = init;