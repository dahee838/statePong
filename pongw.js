//the pong game itself is fine
// 
//do cases then youre DONE!
// 
// 
// insert score == number then switch scene
// insert time == switch scene
// insert mousePos == switch scene
// 
// 

var sceneState = 
{
  INTRO: 0,
  TUTORIAL: 1,
  GAME: 2,
  WIN: 3,
  LOSE: 4
};

var currentState = sceneState.INTRO;


var gameTimer;
var gameTimePressed;
const timeForGame = 5000;

var ball;
var p1, p2;

var p1Score = 0;
var p2Score = 0;
var p1Up = false;
var p1Down = false;
var p1right = false;
var p1left = false;
var p2Up = false;
var p2Down = false;
var p2right = false;
var p2left = false;
var margin = 20;

var cnv;
var colliders = [];



function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function setup() {

  cnv = createCanvas(900, 500);
  centerCanvas();
  ball = new Ball();
  p1 = new Paddle(0);
  p2 = new Paddle(1);
}

function draw() {
  background(0);
  drawField();

  p1.move(p1Up, p1Down, p1left, p1right);
  p2.move(p2Up, p2Down, p2left, p2right);

  ball.update();
  p1.update();
  p2.update();

  p1.display();
  p2.display();

  ball.display(); 

    for (var i = 0; i < colliders.length; i++) {
    colliders[i].update();
  }

   for (var i = 0; i < colliders.length; i++) {
    colliders[i].display();
  }

  checkCollisionWithBall(ball, p1);
  checkCollisionWithBall(ball, p2);

  for (var i = 0; i < colliders.length; i++) {
    checkCollisionWithBall(ball, colliders[i]);
  } 
}

function drawField() {
  stroke(255);
  noFill();
  line(0, margin, width, margin);
  line(0, height - margin, width, height - margin);
  for (var i = margin; i < height - margin - 15; i += 35) {
    var start = i;
    var finish = start + 15;
    line(width/2, start, width/2, finish);
  }

  fill(255);
  noStroke();
  textSize(64);
  textAlign(CENTER, CENTER);
  text(p1Score, width/2-50, 70);
  text(p2Score, width/2+50, 70);
}

function checkCollisionWithBall(ball, other) {
  if (ball.pos.x + ball.width/2 > other.pos.x && 
      ball.pos.x + ball.width/2 < other.pos.x + other.width && 
      ball.pos.y + ball.height/2 > other.pos.y &&
      ball.pos.y + ball.height/2 < other.pos.y + other.height) {
    ball.collided(other);
    other.collided(ball);
  }
}

function Ball() 
{
  this.pos = createVector(width/2, height/2);
  this.vel = createVector(0, 0);
  this.angle = random(TWO_PI);
  this.speed = 7;
  this.vel.x = cos(this.angle) * this.speed;
  this.vel.y = sin(this.angle) * this.speed;
  this.width = 15;
  this.height = 15;

  this.update = function() 
  {
    if (this.pos.x < -this.width) {
      p2Score++;
      this.resetAfterPoint(0);
    } else if (this.pos.x > width) {
      p1Score++;
      this.resetAfterPoint(1);
    }

    if (this.pos.y < margin || 
        this.pos.y > height - margin - this.height) {
      this.vel.y *= -1;
    }

    this.pos.add(this.vel);
  };

  this.display = function() 
  {
    noStroke();
    fill(255);
    rectMode(CORNER);
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }

  this.resetAfterPoint = function(whichPlayer) 
  {
    this.pos = createVector(width/2, height/2);
    this.vel = createVector(0, 0);
    this.speed = 7;
    if (whichPlayer === 1) {
      this.getStartingAngle(4 * PI/6, 8 * PI/6);
    } else if (whichPlayer === 0) {
      this.getStartingAngle(-PI/3, PI/3);
    }
  }

  this.getStartingAngle = function(angleLow, angleHigh) 
  {  
    var angle = random(angleLow, angleHigh);
    this.vel.x = cos(angle) * this.speed;
    this.vel.y = sin(angle) * this.speed;
  }

  this.collided = function(other) 
  {
    
  }
};

function Paddle(num) {
  this.num = num;
  this.width = 15;
  this.height = 80;
  if (num == 0) {
    this.pos = createVector(margin, height/2);
  } else {
    this.pos = createVector(width-this.width-margin, height/2);
  }
  this.vel = createVector(0, 0);


  this.update = function() {
    this.pos.add(this.vel);
  }

  this.display = function() 
  {
    noStroke();
    fill(255);
    rectMode(CORNER);
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }

  this.move = function(up, down,left,right) 
  {
    this.vel.y = 0;
    this.vel.x = 0;
    if (up) 
    {
      if (this.pos.y > margin) 
      {
        this.vel.y = -5;
      } else 
      {
        this.pos.y = margin;
      } 
    }
    if (down) 
    {
      if (this.pos.y + this.height < height - margin) 
      {
        this.vel.y = 5;
      } else 
      {
        this.pos.y = height - this.height - margin;
      }
    } 
    if (left) 
    {
      if (this.pos.x > margin) 
      {
        this.vel.x = -5;
      } else {
        this.pos.x = width - this.width - margin;
      }
    }
    if (right) {
      if (this.pos.x + this.width < width - margin) {
        this.vel.x = 5;
      } else {
        this.pos.x = width - this.width - margin;
      }
    }
  }

  this.collided = function(other) 
  {
    var diff = (other.pos.y + other.height/2) - this.pos.y;
    if (this.num === 0) {
      angle = map(diff, 0, this.height, -PI/3, PI/3);
    }
    if (this.num === 1) {
      angle = map(diff, this.height, 0, 4*PI/6, 8*PI/6);
    }
    other.speed += 1;
    other.vel.x = cos(angle) * other.speed;
    other.vel.y = sin(angle) * other.speed;

  }
}



function keyPressed() {
  if (key === ' ') {

        colliders.push(new Dahee());
  
  if (key === 'W') {
    p1Up = true;
  }
  if (key === 'S') {
    p1Down = true;
  }
    if (key === 'A') {
    p1left = true;
  }
  if (key === 'D') {
    p1right = true;
  }

  if (keyCode === UP_ARROW) {
    p2Up = true;
  }
  if (keyCode === DOWN_ARROW) {
    p2Down = true;
  }
    if (keyCode === LEFT_ARROW) {
    p2left = true;
  }
  if (keyCode === RIGHT_ARROW) {
    p2right = true;
  }
}
}

function keyReleased() {
  if (key === 'W') {
    p1Up = false;
  }
  if (key === 'S') {
    p1Down = false;
  }
    if (key === 'A') {
    p1right = false;
  }
  if (key === 'D') {
    p1left = false;
  }

  if (keyCode === UP_ARROW) {
    p2Up = false;
  }
  if (keyCode === DOWN_ARROW) {
    p2Down = false;
  }
    if (keyCode === LEFT_ARROW) {
    p2left = false;
  }
  if (keyCode === RIGHT_ARROW) {
    p2right = false;
  }
}

//scene drawings

function drawScene(whichScene) {
  switch (currentState) {
    case sceneState.INTRO:
      background(255);
      fill(255);
      textSize(80);
      textAlign(CENTER, CENTER);
      text("PONGED: PRESS SPACE TO START", width/2, height/2);
      break;
      case sceneState.TUTORIAL:
      background(255);
      fill(255);
      textSize(80);
      textAlign(CENTER, CENTER);
      text("PLAYER 1: W,A,S,D\n PLAYER 2: UP, DOWN,LEFT,RIGHT", width/2, height/2);
      break;
    case sceneState.GAME:
      var timeLeft = (timeForGame - (millis() - gameTimer))/1000;
      background(map(timeLeft, 5, 0, 255, 0), 250, 150);
      fill(0);
      textSize(164);
      textAlign(CENTER, CENTER);
      text(timeLeft.toFixed(1), width/2, height/2);
      break;
    case sceneState.WIN:
      background(127 + sin(frameCount * 0.05) * 127, 127 + sin(frameCount * 0.06) * 127, 127 + sin(frameCount * 0.07) * 127);
      fill(0);
      textSize(64);
      textAlign(CENTER, CENTER);
      text("YOU SURVIVED!\n" + gameTimePressed, width/2, height/2 - 70);
      textSize(24);
      text("Press space to restart", width/2, height - 100);
      fill(255);
      textSize(64);
      text("YOU SURVIVED!\n" + gameTimePressed, width/2 + 5, height/2 - 75);
      textSize(24);
      text("Press space to restart", width/2 + 2, height - 102);
      break; 
    case sceneState.LOSE:
      background(10, 10, 10);
      fill(255);
      textSize(64);
      textAlign(CENTER, CENTER);
      text("YOU SUCK.\n" + gameTimePressed, width/2, height/2);
      textSize(24);
      text("Press space to restart", width/2, height - 100);
    default:
      break;
  }


//scene transitions

function checkTransition(whichScene) {
  switch (whichScene) {
    case sceneState.INTRO:
      if (keyPressed === ' ') {
        currentState++;
        setUpScene(currentState);
      }
      break;
    case sceneState.GAME:
      if (keyPressed === ' ') 
      {
        gameTimePressed = (timeForGame - (millis() - gameTimer))/1000;
        gameTimePressed = gameTimePressed.toFixed(3);

        if (gameTimePressed < 0.1 && gameTimePressed > -0.1) 
        {
          currentState = sceneState.WIN;      
        } 
        else 
        {
          currentState = sceneState.LOSE;
        }
        setUpScene(currentState);
    }
      break;
    case sceneState.WIN:
      if (p1Score === 10 || p2Score === 10) 
      {
        currentState = sceneState.INTRO;
        setUpScene(currentState);
      }
      break;
    case sceneState.LOSE:
      if (p1Score < 10 || p2Score < 10 && gameTimer == 5000) 
      {
        currentState = sceneState.GAME;
        setUpScene(currentState);
      }
      break;
    default:
      break;
  }
}


//variables in games
function setUpScene(whichScene) {
  switch (whichScene) {
    case sceneState.INTRO:
      break;
    case sceneState.TUTORIAL:
      tutorialTimer = millis();
      break;
    case sceneState.GAME:
      gameTimer = millis();
      break;
    case sceneState.END:
      break;
    default:
      break;
  }
}



function Dahee() {


  this.pos = createVector(noise(width),random(100,400));

  this.speed = 3;
  
  this.vel = createVector(0, sin(this.angle) * this.speed);

  this.angle+=1;

 
  

  this.update = function() 
   {

    if(this.pos < this.angle)
    {

      this.angle+=30;
      this.pos = 


    }

  }

  this.display = function(b,p) {
    stroke(255);
    fill (random(255),10,30);
    translate(width/2,this.vel);
    rotate(radians(this.angle));
     rect(pos,pos,60,20)
 
  }
  this.collided = function(b) 
  {

    this.angle+=10;
   
  
  
    }
     




        function MaddyRed() {
  }
  this.pos = createVector(random(200,600),random(100,400));

  this.speed = 3;
  this.angle = -100;
  this.vel = createVector(0, sin(this.angle) * this.speed);
  this.width = 50;
  this.height = 50;

  this.update = function() {
  

    if(this.pos.y < margin || 
        this.pos.y > height - margin - this.height){
    this.angle=100;
  print("hit");

    }
  }

  this.display = function() {
    fill(255,0,0);
    ellipse(this.pos.x, this.pos.y, this.width, this.height);
  }

  this.collided = function(other) {
    
    other.angle = random(TWO_PI);
    other.vel.x = cos(other.angle) * other.speed;
    other.vel.y = sin(other.angle) * other.speed;
    r = 255;
    g=0;
    b=0;
    
  }

  switch (floor(random(9))) {
      case 0:
        colliders.push(new Dahee());
        break;
      case 1:
        colliders.push(new MaddyRed());
        break;
      case 2:
        colliders.push(new Yanwen());
        break;
      case 3:
        colliders.push(new AlyssaForrest());
        break;


  function AlyssaForrest() {
  this.pos = createVector(width/2, height/2);
  this.speed = 0;
  this.angle = 0;
  this.vel = createVector(cos(this.angle) * this.speed, sin(this.angle) * this.speed);
  this.height = 0;
  this.width = 0;

  this.update = function() {
    this.pos.add(this.vel);
    if (this.height < height-40){
    this.height = this.height + 0.5;
    this.width = this.width + 0.5;
    } else {
    this.height = this.height;
    this.width = this.width;
    }
  }

  this.display = function() {
    fill(255,0,0);
    ellipse(this.pos.x, this.pos.y, this.width, this.height);
  }

  this.collided = function(other) {
    other.vel.x *= -1;
    this.width = this.width - 5;
    this.height = this.height - 5;
  }
}

  function Yanwen() {
  this.pos = createVector(100, 50);
  this.speed = 3;
  this.angle = random(TWO_PI);
  this.vel = createVector(cos(this.angle) * this.speed, sin(this.angle) * this.speed);
  this.size1 = 8;
  this.size2 = 20;
  this.side = 3;
  var point = this.side;
  var scaleStar = 1;

  this.star = function(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  this.update = function() {
    if (this.pos.x < 10) {
      this.pos = createVector(width/2, height/2);
      point = 3;
      scaleStar = 1;
    } else if (this.pos.x > width - 10) {
      this.pos = createVector(width/2, height/2);
      point = 3;
      scaleStar = 1;
    }

    if (this.pos.y < margin + 20 || 
        this.pos.y > height - margin - 20) {
      this.vel.y *= -1;
      point ++;
      scaleStar += 0.2;

      if (scaleStar > 4){
        scaleStar = 1;
      }
    }
    this.pos.add(this.vel);

    if (point >= 18) {
      point = 3;
    }
  }

  this.display = function() {
     noStroke();
    fill(255, 215 - random(100), 0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount / 100.0);
    scale(scaleStar);
    this.star(0, 0, this.size1, this.size2, point); 
    pop();
  }

  this.collided = function(p) {

    if (this.pos.x + 20 > p.pos.x && this.pos.x + 20 < p.pos.x + p.width ||
      this.pos.x - 20 > p.pos.x && this.pos.x - 20 < p.pos.x + p.width){
      if (this.pos.y > p.pos.y && this.pos.y < p.pos.y + p.height) {
        this.vel.x *= -1;
          point ++;
          scaleStar += 0.2;
      }
    }
  }
}

      


  