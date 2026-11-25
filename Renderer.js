// Renderer.js
// Handles all p5.js drawing for the game. No other class should call
// p5 drawing functions directly, keeping presentation separate from logic.
class Renderer {
  constructor() {
    this.lastErrorMessage = "";
    this.lastErrorTime = -Infinity;

    this.mainHue = random() * 360; // used for background elements
    this.secondaryHue = (this.mainHue + 30) % 360; // used for text elements
  }

  drawBackground() {
    push()
      colorMode(HSL);
      background(color(this.mainHue, 25, 75));
    pop()
  }

  // Draws the input box, showing placeholder text if nothing has been typed yet.
  drawInputBox(currentText) {
    let x = width / 2;
    let y = height * 0.9;
    const timer = constrain(255 - (globalTime - this.lastErrorTime) / 2, 0, 255);
    
    push();
      colorMode(HSL);
      fill(color(this.mainHue, 25, 75));
      noStroke();
      rect(0, height-100, width, 100);
    pop();
    
    push();
      textAlign(CENTER, CENTER);
      stroke(timer);
      strokeWeight(1);
      fill(timer);
      textSize(20);
  
      if (!currentText || currentText === '') {
        text('[  ]', x, y);
        strokeWeight(2);
        stroke(timer, (floor(globalTime / 500) % 2)*255);
        line(x-1, y-7, x-1, y+8)
      } else {
        stroke(timer);
        text(`[ ${currentText} ]`, x, y);
      }
    pop();
  }

  // Draws the current error message (if any) above the input box.
  drawErrorMessage(message) {
    if (message !== "") {
      this.lastErrorMessage = message; 
      this.lastErrorTime = globalTime;
    }
    if (debugging && message !== "") {console.log(message); console.log(this.lastErrorMessage)};
    push()
      textSize(16);
      textAlign(CENTER);
      let timeDiff = globalTime - this.lastErrorTime;
      fill(255, 0, 0, 255-timeDiff/2);
      text(this.lastErrorMessage, width / 2, height*0.875-(timeDiff/16));
    pop();
  }

  // Shown while the model is still loading, before any input is accepted.
  drawLoading() {
    push();
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(16);
    text('Loading...', width / 2, height / 2);
    pop();
  }

  // Draws every guess in the cloud at its current physics-updated position, using the font size calculated from its similarity score.
  drawWordCloud(guesses) {
    push();
    textAlign(LEFT, TOP);
    noStroke();
    colorMode(HSL);
    for (const guess of guesses) {
        fill(guess.isCorrect ? color(120, 100,  23) : color(this.secondaryHue, 60, guess.textLightness));
        textSize(guess.fontSize); // must match the size used to measure width/height in Guess
        text(guess.word, guess.pos.x, guess.pos.y);
    }
    pop();
  }

  drawGuessCounter(numGuesses) {
    push();
      colorMode(HSL);
      noStroke();
      fill(color(this.secondaryHue, 60, 25)); // same as win message background
      let digits = numGuesses == 0 ? 1 : floor(Math.log10(numGuesses)) + 1; // get the number of digits in the number of guesses (will only really be one or two realistically). edge case to catch failure on 0
      rect(width, 0, -(30 + (15*(digits-1))), 40, 0, 0, 15, 0);

      fill(color(this.mainHue, 25, 85)); // same as text on win message
      textSize(30);
      textAlign(RIGHT, TOP);
      text(numGuesses, width - 5, 5)
    pop();
  } 

  // Draws the win message in place of the input box once the secret word is guessed. States the word in text so the win never relies on colour alone.
  drawWinMessage(secretWord, numGuesses) {
    push();
    colorMode(HSL)
    fill(color(this.secondaryHue, 60, 25));
    noStroke();
    rect(0, height-100, width, 100, 15, 15, 0, 0);
    textSize(20);
    fill(color(this.mainHue, 25, 85));
    textAlign(CENTER, CENTER)
    text(`Correct, the secret word was - ${secretWord}!`, width/2, height-62.5);
    text(`It took you ${numGuesses} guess(es) this time`, width/2, height-37.5);
    pop();
  }
}