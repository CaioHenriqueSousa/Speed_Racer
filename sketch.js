var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var pistaImg
var car1Img, car2Img
var car1, car2
var cars
var gameState
var allPlayers
var coinImg
var fuelImg
var coinGroup
var fuelGroup
var obstacle1Image, obstacle2Image
var obstacleGroup
var lifeImg
var blastImg

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  pistaImg = loadImage("./assets/track.jpg");
  car1Img = loadImage("./assets/car1.png")
  car2Img = loadImage("./assets/car2.png")
  coinImg = loadImage("./assets/goldCoin.png")
  fuelImg = loadImage("./assets/fuel.png")
  obstacle1Image = loadImage("./assets/obstacle1.png")
  obstacle2Image = loadImage("./assets/obstacle2.png")
  lifeImg = loadImage("./assets/life.png")
  blastImg = loadImage("./assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState()
  game.start();
  
}

function draw() {
  background(backgroundImage);
  if(playerCount == 2) {
    game.update(1)
  }
  if(gameState == 1) {
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
