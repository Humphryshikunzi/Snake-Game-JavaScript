
// JavaScript Snake example
// Author Jan Bodnar
// http://zetcode.com/javascript/snake/

var canvas;
var ctx;

var head;
var apple;
var ball;

var dots;
var apple_x;
var apple_y;

var leftDirection = false;
var rightDirection = true;
var upDirection = false;
var downDirection = false;
var inGame = true;    

const DOT_SIZE = 10;
const ALL_DOTS = 900;
const MAX_RAND = 29;
const DELAY = 140;
const C_HEIGHT = 450;
const C_WIDTH = 450;    

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

var x = new Array(ALL_DOTS);
var y = new Array(ALL_DOTS);   

var playerName = "";
var score;


function init() {    
   
    showHighestScores();
}    

function loadImages() {
    
    head = new Image();
    head.src = 'assets/head.png';    
    
    ball = new Image();
    ball.src = 'assets/dot.png'; 
    
    apple = new Image();
    apple.src = 'assets/apple.png'; 
}

function createSnake() {

    dots = 3;

    for (var z = 0; z < dots; z++) {
        x[z] = 50 - z * 10;
        y[z] = 50;
    }
}

function checkApple() {

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    }
}    

function doDrawing() {
    
    ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
    
    if (inGame) {

        ctx.drawImage(apple, apple_x, apple_y);

        for (var z = 0; z < dots; z++) {
            
            if (z == 0) {
                ctx.drawImage(head, x[z], y[z]);
            } else {
                ctx.drawImage(ball, x[z], y[z]);
            }
        }    
    } else {

        gameOver();
    }        
}

function gameOver() {
    score = dots - 3;
    
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle'; 
    ctx.textAlign = 'center'; 
    ctx.font = 'normal bold 18px serif';
    
    var divContainer = document.getElementById("dataDisplay");
    divContainer.style.visibility="visible";

    var superControls = document.getElementById("superControls");
    superControls.style.visibility="visible";
    
    ctx.fillText('Game over.  Score : ' + score, C_WIDTH/2, (C_HEIGHT/2)+120);  

    showHighestScores();
}

function checkApple() {

    if ((x[0] == apple_x) && (y[0] == apple_y)) {

        dots++;
        locateApple();
    } 
}

function move() {

    for (var z = dots; z > 0; z--) {
        x[z] = x[(z - 1)];
        y[z] = y[(z - 1)];
    }

    if (leftDirection) {
        x[0] -= DOT_SIZE;
    }

    if (rightDirection) {
        x[0] += DOT_SIZE;
    }

    if (upDirection) {
        y[0] -= DOT_SIZE;
    }

    if (downDirection) {
        y[0] += DOT_SIZE;
    }
}    

function checkCollision() {

    for (var z = dots; z > 0; z--) {

        if ((z > 4) && (x[0] == x[z]) && (y[0] == y[z])) {
            inGame = false;
        }
    }

    if (y[0] >= C_HEIGHT) {
        inGame = false;
    }

    if (y[0] < 0) {
       inGame = false;
    }

    if (x[0] >= C_WIDTH) {
      inGame = false;
    }

    if (x[0] < 0) {
      inGame = false;
    }
}

function locateApple() {

    var r = Math.floor(Math.random() * MAX_RAND);
    apple_x = r * DOT_SIZE;

    r = Math.floor(Math.random() * MAX_RAND);
    apple_y = r * DOT_SIZE;
}    

function gameCycle() { 
    if (inGame) { 
        checkApple();
        checkCollision();
        move();
        doDrawing();
        setTimeout("gameCycle()", DELAY);
    }
}

function quitGame() {
    alert('Testing quit the game')
    window.close();
};

function playGameAgain() {
    var divContainer = document.getElementById("dataDisplay");
    divContainer.style.visibility="hidden";

    var superControls = document.getElementById("superControls");
    superControls.style.visibility="hidden";

    playerName = document.getElementById("playerName").value;  
    if(playerName==''){
        playerName =Math.ceil((Math.random()*100000));
    }

    inGame=true;

    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    loadImages();
    createSnake();
    locateApple();
    setTimeout("gameCycle()", DELAY);
};

function showHighestScores() {
    var players = [
        {
            "Rank": 1,
            "Name": "Bot",
            "Score": 7
        }, 
    ]; 

    var storedPlayers = JSON.parse(localStorage.getItem('storedPlayers'));
    console.log(storedPlayers);
    if(storedPlayers!==null){
        players = storedPlayers;
    }

    var currentPlayer;
    for (let index = 0; index <  players.length; index++) {
        const player = players[index]; 
        if(player["Name"]==playerName){
            currentPlayer = player;          
            break;
        }      
    };     

    var newPlayer;
    if(currentPlayer==null) {
        newPlayer = {
            "Rank": 0,
            "Name": playerName,
            "Score": score
        }
        if(score!==undefined){
            players.push(newPlayer);
        }
    }
    else{
        if(currentPlayer.Score < score){
            players.pop(currentPlayer);
            currentPlayer.Score = score;
            players.push(currentPlayer);
        }; 
       
    } 

    players.sort((a, b) => Number(b.Score) - Number(a.Score));     
    players =  players.slice(0,10);

    localStorage.setItem('storedPlayers', JSON.stringify(players));

    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 0; i < players.length; i++) {
        for (var key in players[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    };
    
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
   
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
    var tr = table.insertRow(-1); // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th"); // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    };
   
    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < players.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) { 
            var tabCell = tr.insertCell(-1);
            if(j===0){                
                tabCell.innerHTML = i + 1;
            }else{                
             tabCell.innerHTML = players[i][col[j]];
            }
        }
    };
    
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
};


onkeydown = function(e) {
    
    var key = e.keyCode;
    
    if ((key == LEFT_KEY) && (!rightDirection)) {
        
        leftDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == RIGHT_KEY) && (!leftDirection)) {
        
        rightDirection = true;
        upDirection = false;
        downDirection = false;
    }

    if ((key == UP_KEY) && (!downDirection)) {
        
        upDirection = true;
        rightDirection = false;
        leftDirection = false;
    }

    if ((key == DOWN_KEY) && (!upDirection)) {
        
        downDirection = true;
        rightDirection = false;
        leftDirection = false;
    }        
};    
