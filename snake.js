var context;

var width = 300;
var height = 400;

var snakeLength = 3;
var level = 1;
var sqSize = 10;
var bodyX = new Array(150, 150-sqSize, 150-2*sqSize);
var bodyY = new Array(200, 200, 200);

var vX = new Array(1, 1, 1);
var vY = new Array(0, 0, 0);

var rX;
var rY;

var score = 0;
var scoreDiv;
var eaten = true;
var gameOver = false;
var controlsDiv;

function drawCanvasBoundary() {
  context.fillStyle="#FFF";
  context.fillRect(0,0,width,height);
  context.fill();
  context.strokeStyle="#000";
  context.strokeRect(0,0,width,height);
}

function drawPoint(x,y) {
  context.fillStyle = "#000";
  context.fillRect(x,y,sqSize, sqSize);
  context.fill();
  context.strokeStyle="#FFFFFF";
  context.strokeRect(x,y,sqSize, sqSize);
}

function drawSnake() {
  for(var i=0; i < snakeLength; i++)
    drawPoint(bodyX[i],bodyY[i]);
}

function init() {
  context = document.getElementById("canvas").getContext("2d");
  drawCanvasBoundary();
  drawSnake();
  intervalId = setTimeout(gameProcess, 1000/6);
  scoreDiv = document.getElementById("score");
  controlsDiv = document.getElementById("control");
  window.onkeydown = keydown;
}

function moveSnake() {
  for(var i=0; i < snakeLength; i++) {
    bodyX[i] += (vX[i]*sqSize);
    bodyY[i] += (vY[i]*sqSize);
  }

  for(var i=snakeLength-1; i>0; i--) {
    vX[i] = vX[i-1];
    vY[i] = vY[i-1];
  }
  eatRat();
}


function keydown(e) {
  if(e.keyCode == 65 && vX[0] != 1) {
    vX[0] = -1;
    vY[0] = 0;
  }
  else if (e.keyCode == 87 && vY[0] != 1) {
    vY[0] = -1;
    vX[0] = 0;
  }
  else if (e.keyCode == 68 && vX[0] != -1) {
    vX[0] = 1;
    vY[0] = 0;
  }
  else if (e.keyCode == 83 && vY[0] != -1) {
    vY[0] = 1;
    vX[0] = 0;
  }
  else if (e.keyCode == 13 && gameOver === true) {
    gameOver = false;
    restart();
  }
}

function gameProcess() {
  intervalId = setTimeout(gameProcess, 1000/(6*level));

  clear();
  drawCanvasBoundary();
  placeRat();
  moveSnake();
  checkCollision();
  drawSnake();
}

function clear() {
  context.clearRect(0,0,width,height);
}

function placeRat() {
  if(eaten)
    {
      rX = Math.floor(width*Math.random()/sqSize)*sqSize;
      rY = Math.floor(height*Math.random()/sqSize)*sqSize;
      if(checkFoodCollision(rX,rY))
        placeRat();
      else
        eaten = false;
    }
    drawPoint(rX, rY);
}

function checkFoodCollision(x, y) {
  for (var i = 0;i<snakeLength; i++) {
    if(x == bodyX[i]&& y == bodyY[i])
    {
      return true;
    }
  }
  return false;
}

function eatRat() {
  if(bodyX[0] == rX && bodyY[0] == rY) {
    eaten = true;
    var newX = bodyX[snakeLength-1]-vX[snakeLength-1]*sqSize;
    var newY = bodyY[snakeLength-1]-vY[snakeLength-1]*sqSize;

    bodyX.push(newX);
    bodyY.push(newY);

    vX.push(vX[snakeLength-1]);
    vY.push(vY[snakeLength-1]);
    snakeLength++;

    score += 10;

    if((score%100) === 0)
      level++;

    scoreDiv.innerHTML = "Score: ";
    +score+"     Level: "+level;
  }
}

function checkCollision() {
  if(bodyX[0] >= width || bodyX[0] < 0 || bodyY[0] < 0 || bodyY[0] >= height) {
    scoreDiv.innerHTML = "Score: ";
    +score+"     Level: ";
    +level+"     <b>Game Over</b>";
    controlDiv.innerHTML = "Press \"Enter\" to restart";
    gameOver = true;
    clearTimeout(intervalId);
  }
  else if(snakeLength > 4) {
    if(checkSelfCollision(bodyX[0],bodyY[0])) {
      scoreDiv.innerHTML = "Score: " ;
      +score+"     Level: ";
      +level+"     <b>Game Over</b>";
      controlDiv.innerHTML = "Press \"Enter\" to restart";
      gameOver = true;
      clearTimeout(intervalId);
    }
  }
}


function checkSelfCollision(x, y) {
  for (var i = 4; i < snakeLength; i++){
    if(x == bodyX[i] && y == bodyY[i]) {
      return true;
    }
  }
  return false;
}

function restart() {
  bodyX = new Array(150, 150-sqSize, 150-2*sqSize);
  bodyY = new Array(200, 200, 200);

  vX = new Array(1, 1, 1);
  vY = new Array(0, 0, 0);

  snakeLength = 3;

  score = 0;
  level  = 1;

  eaten = true;

  scoreDiv.innerHTML = "Score: " +score+"Level: "+level;
  controlDiv.innerHTML = "Controls: W = Up; A = Left; S = Down; D = Right";

  intervalId = setTimeout(gameProcess, 1000/6);
}

window.addEventListener("load", init, true);


