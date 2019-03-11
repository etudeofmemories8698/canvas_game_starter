/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 960;
canvas.height = 540;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, boostingSeedReady;
let bgImage, heroImage, monsterImage, boostingSeedImage;

//Define monsters and hero position

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = getRandomInt(32, canvas.width - 32);
let monsterY = getRandomInt(32, canvas.height - 32);

let seedX = getRandomInt(32, canvas.width - 32);
let seedY = getRandomInt(32, canvas.height - 32);

//Monsters caught
let monstersCaught = 0;

//Time start and end
let startTime;
let endTime;
let timePlayed = 0;
let pastScores = [];
let bestScore = 0;

//sound
let myMusic;
let mySound;
let bouncingSound;
let gameoverSound;
let boostingSound;
let toxicSound;

//monsters direction
let direction = getRandomIntFromArray([1, 2, 3, 4, 5, 6, 7, 8]);

//finish game
let finished = false;

//define path for restart button
const path = new Path2D()
path.rect(canvas.width / 2 - 50, canvas.height / 2 + 15, 100, 35)
path.closePath()

//hero speed
let heroSpeed = 6;
let boostingHeroSpeed = [1, 3, 9, 11];

//counter for boosting seed
let counter = 6;

//boosting timer
let boostingSpeed;

function loadImages() {
  //start counting time
  startTime = new Date();

  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };

  monsterImage.src = `images/monster${getRandomInt(1, 7)}.png`;

  //boosting seeds image
  boostingSeedImage = new Image();
  boostingSeedImage.onload = function () {
    // show the seeds image
    boostingSeedReady = true;
  };

  boostingSeedImage.src = `images/boostingSeed${getRandomInt(1, 4)}.png`;

  //sound when collide

  mySound = new sound("musics/collide.wav");

  //background music
  myMusic = new sound("musics/background_music.mp3");

  //bouncing sound
  bouncingSound = new sound("musics/bouncing.wav")

  //gameover sound
  gameoverSound = new sound("musics/game_over.mp3")

  //boosting sound
  boostingSound = new sound("musics/boosting.wav")

  myMusic.play();

  //define distance
  let distance = 0;

  //load boosting seed timer
  boostingTimer();

}

let keysDown = {};

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 

  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


let update = function () {
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);


  if (38 in keysDown) { // Player is holding up key
    heroY -= heroSpeed;
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += heroSpeed;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= heroSpeed;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += heroSpeed;
  }

  heroX = Math.min(canvas.width - 32, heroX);
  heroX = Math.max(0, heroX);

  heroY = Math.min(canvas.height - 37, heroY);
  heroY = Math.max(0, heroY);

  //Automate the monster

  movingMonsters();

  // Check if player and monster collided

  if (
    heroX <= (monsterX + 32) &&
    monsterX <= (heroX + 32) &&
    heroY <= (monsterY + 63) &&
    monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.

    monsterX = getRandomInt(32, canvas.width - 32);
    monsterY = getRandomInt(32, canvas.height - 32);

    //Increase score

    if (monstersCaught < 5) {
      ++monstersCaught;
      finished = false;
    }

    if (monstersCaught == 5) {

      getTimePlayed();

      getBestScore(pastScores);

      gameoverSound.play();
      //hide monster and hero

      finished = true;

    }

    //Change monster

    monsterImage.src = `images/monster${getRandomInt(1, 7)}.png`;

    //collide sound start

    mySound.play();

  }

  //check if hero has ate the boosting seed
  if (
    heroX <= (seedX + 24) &&
    seedX <= (heroX + 24) &&
    heroY <= (seedY + 24) &&
    seedY <= (heroY + 24)
  ) {

    //hide seed
    boostingSeedReady = true;
    seedX = -25;
    seedY = -25;

    //start boosting speed for 2s
    heroSpeed = boostingHeroSpeed[getRandomInt(0, boostingHeroSpeed.length - 1)];
    
    if (heroSpeed < 6) {
      heroImage.src = "images/hero3.png";
    } else if (heroSpeed > 6) {
      heroImage.src = "images/hero2.png";
    }

    //Change boostingSed image
    boostingSeedImage.src = `images/boostingSeed${getRandomInt(1, 4)}.png`;

    //play sound when ate the seed
    boostingSound.play();
  }
};


//This function set timer for boosting seeds
function boostingTimer() {
  boostingSpeed = setInterval(function () {

    if (counter <= 2) {
      heroSpeed = 6;
      seedX = -25;
      seedY = -25;
      boostingSeedReady = false;

      //reset hero Image
      heroImage.src = "images/hero.png";
    };
    if (counter <= 0) {
      clearInterval(boostingSpeed);

      seedX = getRandomInt(24, canvas.width - 24);
      seedY = getRandomInt(24, canvas.height - 24);
      boostingSeedReady = true;
      counter = 6;
      boostingTimer();
    };
    counter--;
  }, 1000);
}


var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (boostingSeedReady) {
    ctx.drawImage(boostingSeedImage, seedX, seedY);
  }


  //Display scores
  ctx.fillStyle = "#ffffff";
  ctx.font = '24px cursive';
  ctx.textAlign = "left";
  ctx.fillText("Monsters caught: " + monstersCaught, 20, 35);

  if (finished == true) {
    ctx.textAlign = "left";
    ctx.fillText("Time played: " + timePlayed + " (s) ", 20, 65);
    ctx.textAlign = "center";
    ctx.fillText("Game over", canvas.width / 2, canvas.height / 2 - 50);
    ctx.textAlign = "center";
    ctx.fillText("Your best time score: " + bestScore + " (s)", canvas.width / 2, canvas.height / 2 - 10);

    //hide hero and boostingSeed when finished/ but left the cat boucing 
    heroReady = false;
    boostingSeedReady = false;
    clearInterval(boostingSpeed);

    //restart button

    ctx.fillStyle = "#FFFFFF"
    ctx.fill(path)
    ctx.lineWidth = 2
    ctx.strokeStyle = "#000000"
    ctx.stroke(path)
    ctx.fillStyle = "black"
    ctx.fillText("Restart", canvas.width / 2, canvas.height / 2 + 40)
  }

};

var main = function () {

  update();

  render();

  requestAnimationFrame(main);

}

//this function exist to get sound
function sound(src) {

  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }

}

//Time played each round
function getTimePlayed() {
  endTime = new Date();
  timePlayed = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  pastScores.push(timePlayed);
}

//Generate random interger number
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Generate random item from Arr
function getRandomIntFromArray(arr) {
  return arr[getRandomInt(0, arr.length - 1)];
}

//Move the monster
function moveMonster(dir) {

  if (dir == 1) { //up
    monsterY -= 6;
  }
  if (dir == 2) { //right
    monsterX += 6;
  }
  if (dir == 3) { //down
    monsterY += 6;
  }
  if (dir == 4) { //left
    monsterX -= 6;
  }
  if (dir == 5) { //up right
    monsterY -= 6;
    monsterX += 6;
  }
  if (dir == 6) { //right down
    monsterX += 6;
    monsterY += 6;
  }
  if (dir == 7) { //left down
    monsterX -= 6;
    monsterY += 6;
  }
  if (dir == 8) { //up left
    monsterX -= 6;
    monsterY -= 6;
  }

}

function movingMonsters() {

  //find distance between hero and monster by math.
  distance = Math.sqrt(Math.pow((monsterX - heroX), 2) + Math.pow((monsterY - heroY), 2));

  //If monster get close to hero
  if ((distance < 80) && (monsterX <= heroX) && (monsterY <= heroY)) {
    direction = getRandomIntFromArray([1, 4, 8]);
  }
  if ((distance < 80) && (monsterX >= heroX) && (monsterY <= heroY)) {
    direction = getRandomIntFromArray([1, 2, 5]);
  }
  if ((distance < 80) && (monsterX > heroX) && (monsterY > heroY)) {
    direction = getRandomIntFromArray([2, 3, 6]);
  }
  if ((distance < 80) && (monsterX < heroX) && (monsterY > heroY)) {
    direction = getRandomIntFromArray([3, 4, 7]);
  }

  //If monster hit the wall
  if (monsterX >= canvas.width - 32) {
    direction = getRandomIntFromArray([4, 7, 8]);
    bouncingSound.play();
  }
  if (monsterX <= 0) {
    direction = getRandomIntFromArray([2, 5, 6]);
    bouncingSound.play();
  }
  if (monsterY >= canvas.height - 63) {
    direction = getRandomIntFromArray([1, 5, 8]);
    bouncingSound.play();
  }
  if (monsterY <= 0) {
    direction = getRandomIntFromArray([3, 6, 7]);
    bouncingSound.play();
  }

  //After having the direction needed, move the monster
  moveMonster(direction);

}

function resetPos() {
  //hero to center
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;

  //monster to random position
  monsterX = getRandomInt(32, canvas.width - 32);
  monsterY = getRandomInt(32, canvas.height - 32);
}

//Restart button
function getXY(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const y = event.clientY - rect.top
  const x = event.clientX - rect.left
  return {
    x: x,
    y: y
  }
}

function getBestScore(arr) {
  bestScore = Math.min(...arr);
}

//This function make the restart button work
document.addEventListener("click", function (e) {
  const XY = getXY(canvas, e)
  if (ctx.isPointInPath(path, XY.x, XY.y)) {

    // Do Something with the click
    startTime = new Date();
    monstersCaught = 0;
    heroReady = true;
    finished = false;
    resetPos();

    clearInterval(boostingSpeed);
    boostingTimer();

  }

}, false)

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();