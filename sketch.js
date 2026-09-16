// sketch.js
let debugging = true;
let atCollege = true;

let game;

async function setup() {
  createCanvas(800, 600);
  game = new Game();
  await game.setup();
}

function draw() {
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