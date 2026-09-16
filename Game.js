// Game.js
// Coordinates WordBank, InputHandler, Embedder, Scorer and Renderer for a
// single game session.
class Game {
  constructor() {
    this.wordBank = new WordBank();
    this.renderer = new Renderer();
    this.inputHandler = new InputHandler();
    this.embedder = new Embedder();
    this.scorer = new Scorer();

    this.secretWord = null;
    this.secretVector = null; // cached once in setup(), see DE3 justification
    this.previousGuesses = new Set(); // Set for O(1) duplicate lookup, see DE4
    this.lastResult = null; // { word, score, fontSize } of the most recent valid guess

    this.modelLoaded = false;
    this.isProcessingGuess = false; // prevents overlapping guesses while embed() is awaited
  }

  async setup() {
    await this.wordBank.loadWords();
    let secretData = this.wordBank.pickSecret();
    this.secretWord = secretData.word;
    if (debugging) {console.log(secretData.theme, secretData.word)};

    if (!atCollege) {
      await this.embedder.loadModel()
      this.secretVector = await this.embedder.embed(this.secretWord); // cached once, per DE3
    }
    this.modelLoaded = true;
  }

  draw() {
    background(240);

    if (!this.modelLoaded) {
      this.renderer.drawLoading();
      return;
    }
    this.inputHandler.updateBackspace();
    this.renderer.drawInputBox(this.inputHandler.getValue());
    this.renderer.drawErrorMessage(this.inputHandler.getError());
    if (this.lastResult) {
      this.renderer.drawResult(this.lastResult);
    }
  }

  // Called when the user presses Enter. Follows the pipeline designed in DE3:
  // validate -> check duplicate -> embed -> score -> map font size -> display.
  async submitGuess() {
    if (!this.modelLoaded || this.isProcessingGuess) return;

    let guess = this.inputHandler.getValue();
    if (guess === '') return;

    if (!this.wordBank.isValidWord(guess)) {
      this.inputHandler.errorMessage = 'Not a valid word';
      this.inputHandler.clearInput();
      return;
    }

    if (this.previousGuesses.has(guess)) {
      this.inputHandler.errorMessage = 'Already guessed';
      this.inputHandler.clearInput();
      return;
    }

    this.isProcessingGuess = true;
    
    if (!atCollege) {
      let guessVector = await this.embedder.embed(guess);
      let score = this.scorer.cosineSim(guessVector, this.secretVector);
      let fontSize = this.scorer.mapFontSize(score);
    }

    this.lastResult = { word: guess, score: 'score', fontSize: 'fontSize' };
    this.previousGuesses.add(guess);
    this.inputHandler.clearInput();
    this.isProcessingGuess = false;
  }
}