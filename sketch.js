// sketch.js
let debugging = false;
let atCollege = false;

let game;
let globalTime;

async function setup() {
  createCanvas(windowWidth, windowHeight);
  game = new Game();
  await game.setup();
}

function draw() {
  globalTime = millis();
  game.draw();
  if (debugging) {
    text(`${mouseX}, ${mouseY}`, mouseX, mouseY)
  }
}

function keyPressed() {
  if (key === ENTER) {
    game.submitGuess(); // async, deliberately not awaited here — draw() keeps running while this resolves
  } else if (key === BACKSPACE) {
    game.inputHandler.lastBackspace = millis() + 500;
    game.inputHandler.handleBackspace();
  } else {
    game.inputHandler.handleKeyPress(key);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}