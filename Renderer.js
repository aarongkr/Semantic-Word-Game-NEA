// Renderer.js
// Handles all p5.js drawing for the game. No other class should call
// p5 drawing functions directly, keeping presentation separate from logic.
class Renderer {
  constructor() {
    this.lastErrorMessage = "";
    this.lastErrorTime = -Infinity;
  }

  // Draws the input box, showing placeholder text if nothing has been typed yet.
  drawInputBox(currentText) {
    let x = width / 2;
    let y = height * 0.9;

    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    stroke(255-((globalTime-this.lastErrorTime)/2), 0, 0);
    strokeWeight(1);
    fill(255-((globalTime-this.lastErrorTime)/2), 0, 0);
    textSize(20);

    if (!currentText || currentText === '') {
      text('[  ]', x, y);
      strokeWeight(2);
      stroke(255-((globalTime-this.lastErrorTime)/2), 0, 0, (floor(globalTime / 500) % 2)*255);
      line(x-1, y-7, x-1, y+8)
    } else {
      stroke(255-((globalTime-this.lastErrorTime)/2), 0, 0);
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
    if (debugging) {console.log(message); console.log(this.lastErrorMessage)};
    push()
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

  // Displays the most recent guess as a single string containing the word, its similarity score, and its mapped font size
  drawResult(result) {
    push();
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(16);
    text(`${result.word} - score: ${result.score.toFixed(3)}, size: ${result.fontSize}`, width / 2, height / 2);
    
    pop();
  }
}