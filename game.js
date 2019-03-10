/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

var timeleft = 40;
var downloadTimer = setInterval(function () {
  timeleft -= 1;
  if (timeleft <= 0)
    clearInterval(downloadTimer);
}, 1000);

// sound object
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


myMusic = new sound("MarioBros.mp4");


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// counter and canvas variables
let canvas;
let ctx;
let highScoreCounter = 0;

let counter = 0;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let gameOver = false;

let bgReady, heroReady, monsterReady, obstacle1Ready, obstacle2Ready, obstacle3Ready, obstacle4Ready;
let bgImage, heroImage, monsterImage, obstacle1Image, obstacle2Image, obstacle3Image, obstacle4Image;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/tiles.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the mouse image
    heroReady = true;
  };
  heroImage.src = "images/mouse.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/cheese.png";

  obstacle1Image = new Image();
  obstacle1Image.onload = function () {
    // show the Obstacle image
    obstacle1Ready = true;
  };
  obstacle1Image.src = "images/knife.png";

  obstacle2Image = new Image();
  obstacle2Image.onload = function () {
    // show the Obstacle image
    obstacle2Ready = true;
  };
  obstacle2Image.src = "images/knife.png";

  obstacle3Image = new Image();
  obstacle3Image.onload = function () {
    // show the Obstacle image
    obstacle3Ready = true;
  };
  obstacle3Image.src = "images/knife.png";

  obstacle4Image = new Image();
  obstacle4Image.onload = function () {
    // show the Obstacle image
    obstacle4Ready = true;
  };
  obstacle4Image.src = "images/knife.png";

}
ctx.font = "20px Georgia";
ctx.font = "30px Verdana";


/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

// Monster and Obstacle Variables
let monsterX = 70;
let monsterY = 100;
let obstacle1ImageX = 50;
let obstacle1ImageY = 50;
let obstacle2ImageX = 300;
let obstacle2ImageY = 300;
let obstacle3ImageX = 400;
let obstacle3ImageY = 50;
let obstacle4ImageX = 250;
let obstacle4ImageY = 200;

// randomize speed and direction of monster
let monsterSpeed = 5;
let monsterDirection = 1;
let monsterDirectionY = 1;

let musicStarted = false;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/


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


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */


let update = function () {

  if (38 in keysDown) { // Player is holding up key
    heroY -= 5;
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 5;
  }
 

  // if Monster hits wall (monsterX > canvas.width)
  if (monsterX + 60 > canvas.width || monsterX <= 0) {
    monsterDirection = monsterDirection * -1;
  }
  monsterX += (monsterSpeed * monsterDirection);

  if (monsterY + 70 > canvas.width || monsterY <= 0) {
    monsterDirectionY = monsterDirectionY * -1;
  }

  monsterY += (monsterSpeed * monsterDirectionY);

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    counter++;

    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location
    
    monsterX = getRandomInt(0, 400);
    monsterY = getRandomInt(0, 400);
  }
  heroX = Math.min(canvas.width - 60, heroX);
  heroX = Math.max(0, heroX);
  heroY = Math.min(canvas.height - 60, heroY);
  heroY = Math.max(0, heroY);

  if (heroX <= (obstacle1ImageX + 32)
    && obstacle1ImageX <= (heroX + 32)
    && heroY <= (obstacle1ImageY + 32)
    && obstacle1ImageY <= (heroY + 32)
    && counter >= 5) {
    gameOver = true;
  }

  if (heroX <= (obstacle2ImageX + 32)
    && obstacle2ImageX <= (heroX + 32)
    && heroY <= (obstacle2ImageY + 32)
    && obstacle2ImageY <= (heroY + 32)
    && counter >= 10) {
    gameOver = true;
  }

  if (heroX <= (obstacle3ImageX + 32)
    && obstacle3ImageX <= (heroX + 32)
    && heroY <= (obstacle3ImageY + 32)
    && obstacle3ImageY <= (heroY + 32)
    && counter >= 15) {
    gameOver = true;
  }

  if (timeleft == 0) {
    gameOver = true;
  }

};

/**
 * This function, render, runs as often as possible.
 */
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
  if (obstacle1Ready && counter >= 5) {
    ctx.drawImage(obstacle1Image, obstacle1ImageX, obstacle1ImageY);
  }
  if (obstacle2Ready && counter >= 10) {
    ctx.drawImage(obstacle2Image, obstacle2ImageX, obstacle2ImageY);
  }
  if (obstacle3Ready && counter >= 15) {
    ctx.drawImage(obstacle3Image, obstacle3ImageX, obstacle3ImageY);
  }

  if (obstacle4Ready && counter >= 17) {
    ctx.drawImage(obstacle4Image, obstacle4ImageX, obstacle4ImageY);
  }

  if (monsterImage) {
    monsterImage = new Image();
    monsterImage.onload = function () {
      // show the monster image
      monsterReady = true;
    };
    monsterImage.src = "images/bread.png";

  }
  if (counter >= 5 && counter <= 10) {
    monsterImage = new Image();
    monsterImage.onload = function () {
      // show the monster image
      monsterReady = true;
    };
    monsterImage.src = "images/pizza.png";
  }

  if (counter >= 10 && counter <= 20) {
    monsterImage = new Image();
    monsterImage.onload = function () {
      // show the monster image
      monsterReady = true;
    };
    monsterImage.src = "images/cheese.png";
  }

  // Create gradient
  var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop("0", " magenta");
  gradient.addColorStop("0.5", "blue");
  gradient.addColorStop("1.0", "red");

  // Fill with gradient
  ctx.fillStyle = gradient;

  if (gameOver) {
    ctx.fillText(`GAME OVER`, 170, 240);
    ctx.fillText(`Score:${counter}`, 200, 190);
    event.stopPropagation();
  }

  if (counter == 20) {
    ctx.fillText("Winner", 170, 240);
    event.stopPropagation();
  }

  else {
    ctx.fillText(`Score:${counter}`, 10, 50);
  }
  ctx.fillText(`Timer: ${timeleft}`, 350, 50);

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {

  myMusic.play(); // fix later
  update();
  render();

  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  
  if (counter >= 20) {
    ctx.fillText(`Well Done`, 170, 240);
    ctx.fillText(counter, 100, 100);
  }
  if (timeleft == 0) {
    ctx.fillText(`GAME OVER`, 170, 240);
    ctx.fillText(counter, 100, 100);
  }
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();

main();

