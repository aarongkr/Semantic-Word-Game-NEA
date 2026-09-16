// InputHandler.js
// Captures and validates keyboard input character-by-character before it is
// submitted as a guess, applying the character and length checks from DE4.
class InputHandler {
  constructor() {
    this.currentInput = '';
    this.errorMessage = '';
    this.lastBackspce = 0;
  }

  // Called by keyTyped() in sketch.js for every printable character typed.
  // Applies a character check (letters only) and length check (max 45), and normalises to lowercase so WordBank always receives consistent input.
  handleKeyPress(key) {
    if (key == BACKSPACE) {}
    key = key.toLowerCase();
    const letters = 'abcdefghijklmnopqrstuvwxyz';

    if (!letters.includes(key)) {
      this.errorMessage = 'Letters only';
      return;
    }
    if (this.currentInput.length >= 45) {
      this.errorMessage = 'Character limit reached';
      return;
    }

    this.currentInput += key;
    this.errorMessage = ''; // clear any previous error on a successful character
  }

  // Called by keyPressed() in sketch.js when BACKSPACE is detected.
  handleBackspace() {
    this.currentInput = this.currentInput.slice(0, -1);
    this.errorMessage = '';
  }

  updateBackspace() {
    if (keyIsDown(BACKSPACE)) {
      const start = millis();
      if (start - this.lastBackspace >= 40) {
        this.handleBackspace();
        this.lastBackspace = millis();
      }
    }
  }

  getValue() {
    return this.currentInput;
  }

  getError() {
    return this.errorMessage;
  }

  clearInput() {
    this.currentInput = '';
  }
}