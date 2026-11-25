// Game.js
// Coordinates WordBank, InputHandler, Embedder, Scorer and Renderer for a single game session.
class Game {
  constructor() {
    this.wordBank = new WordBank();
    this.renderer = new Renderer();
    this.inputHandler = new InputHandler();
    this.embedder = new Embedder();
    this.scorer = new Scorer();
    this.wordCloud = new WordCloud();

    this.secretWord = null;
    this.secretVector = null; // cached once in setup(), see DE3 justification
    this.previousGuesses = new Set(); // Set for O(1) duplicate lookup, see DE4

    this.modelLoaded = false;
    this.isProcessingGuess = false; // prevents overlapping guesses while embed() is awaited
    this.isGameOver = false;
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
    this.renderer.drawBackground();
    
    if (!this.modelLoaded) {
      this.renderer.drawLoading();
      return;
    }
    
    if (!this.isGameOver) { // input hidden on game win
      this.inputHandler.updateBackspace();
      this.wordCloud.update();
      this.renderer.drawWordCloud(this.wordCloud.getGuesses());
      this.renderer.drawInputBox(this.inputHandler.getValue());
      this.renderer.drawErrorMessage(this.inputHandler.getError());
    } else {
      this.wordCloud.update(); // the cloud keeps moving on game win
      this.renderer.drawWordCloud(this.wordCloud.getGuesses());
      this.renderer.drawWinMessage(this.secretWord, this.wordCloud.getGuesses().length);
    }
    this.renderer.drawGuessCounter(this.wordCloud.getGuesses().length);

    this.inputHandler.errorMessage = "";
  }

  // Called when the user presses Enter. Follows the pipeline designed in DE3: validate -> check duplicate -> embed -> score -> map font size -> display.
  async submitGuess() {
    let isCorrect;
    if (!this.modelLoaded || this.isProcessingGuess || this.isGameOver) return;

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
    let score = random(0, 0.5);
    if (!atCollege) {
      let guessVector = await this.embedder.embed(guess);
      score = this.scorer.cosineSim(guessVector, this.secretVector);
    }
    if (debugging) {console.log(score)};
    let fontSize = this.scorer.mapFontSize(score);
    if (guess === this.secretWord) {
      this.isGameOver = true; // win check reuses the already-validated guess, per DE4
      isCorrect = true;
    } else {
      isCorrect = false;
    }
    this.wordCloud.addGuess(guess, fontSize, isCorrect);
    this.previousGuesses.add(guess);
    this.inputHandler.clearInput();

    this.isProcessingGuess = false;
  }
}