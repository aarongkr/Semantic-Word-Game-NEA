// Scorer.js
// Compares two word embeddings and maps the result to a usable font size.
class Scorer {
  constructor() {}

  // Calculates cosine similarity between two equal-length vectors, returning a value between -1 and 1, where 1 indicates identical meaning.
  cosineSim(vectorA, vectorB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }

  // Maps a cosine similarity score (-1 to 1) to a font size, using a cubic curve so that only actually close guesses appear noticeably larger, as justified in DE3.
  mapFontSize(score) {
    const MIN_SIZE = 12;
    const MAX_SIZE = 72;
    const MIN_SCORE = 0.15;
    const MAX_SCORE = 0.85;

    if (score < MIN_SCORE) {
        return MIN_SIZE;
    }
    if (score > MAX_SCORE) {
        return MAX_SIZE;
    }

    const x = (score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
    const curved = 3 * x ** 2 - 2 * x ** 3;
    return (MIN_SIZE + curved * (MAX_SIZE - MIN_SIZE));
  }
}