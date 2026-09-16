// WordBank.js
// Handles loading word data, selecting the secret word, and validating guesses against the Scrabble word list using binary search

class WordBank {
  constructor() {
    this.secretWordList = null; // themes and their associated words
    this.validWords = null; // sorted array of valid english words
  }

  // loads both word data files asynchronously, must be completed before pickSecret() or isValidWord() are called, as both depend on this data
  async loadWords() {
    this.secretWordList = await loadJSON('data/words.json');
    this.validWords = await loadJSON('data/validWords.json')
  }

  // selects a random theme, then a random word within that theme, to act as the secret word for the current session
  pickSecret() {
    let themeNames = Object.keys(this.secretWordList)
    let themeIndex = int(random(0, themeNames.length)); // random is not inclusive of upper bound, and int rounds down, so the traditional '-1' isn't needed
    let chosenTheme = themeNames[themeIndex];
    let chosenThemeWords = this.secretWordList[chosenTheme]

    let wordIndex = int(random(0, chosenThemeWords.length));
    let chosenWord = chosenThemeWords[wordIndex];

    return { theme: chosenTheme, word: chosenWord }
  }

  
  // checks whether a guess exists in the sorted validWords list using a binary search, since the list is static and presorted alphabetically
  isValidWord(guess) {
    let low = 0;
    let mid;
    let high = this.validWords.length - 1
    while (low <= high) {
      mid = int((low + high) / 2);
      if (this.validWords[mid] === guess) {
        return true;
      } else if (this.validWords[mid] < guess) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return false;
  }
  
}