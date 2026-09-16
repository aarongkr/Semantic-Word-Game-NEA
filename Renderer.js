// Renderer.js
// Handles all p5.js drawing for the game. No other class should call
// p5 drawing functions directly, keeping presentation separate from logic.
class Renderer {
  constructor() {}

  // Draws the input box, showing placeholder text if nothing has been typed yet.
  drawInputBox(currentText) {
    let x = width / 2;
    let y = 500;

    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(1);
    fill(0, 0, 0);
    textSize(20);

    if (!currentText || currentText === '') {
      text('[  ]', x, y);
      strokeWeight(2);
      stroke(0, 0, 0, (floor(millis() / 500) % 2)*255);
      line(x-1, y-7, x-1, y+8)
    } else {
      text(`[ ${currentText} ]`, x, y);
    }
    pop();
  }

  // Draws the current error message (if any) above the input box.
  drawErrorMessage(message) {
    if (!message || message === '') return;
    push();
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    textSize(12);
    text(message, width / 2, 480);
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

  // Displays the most recent guess as a single string containing the word, its similarity score, and its mapped font size
  drawResult(result) {
    push();
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(16);
    if (!atCollege) {
      text(`${result.word} - score: ${result.score.toFixed(3)}, size: ${result.fontSize}`, width / 2, 350);
    } else {
      text(`${result.word} — score: securly messed this bit up, size: this bit too`, width / 2, 350);
    }
    
    pop();
  }
}