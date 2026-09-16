// Scorer.js
// Compares two word embeddings and maps the result to a usable font size.
class Scorer {
  constructor() {}

  // Calculates cosine similarity between two equal-length vectors, returning
  // a value between -1 and 1, where 1 indicates identical meaning.
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

  // Maps a cosine similarity score (-1 to 1) to a font size, using a cubic
  // curve so that only genuinely close guesses appear noticeably larger,
  // as justified in DE3.
  mapFontSize(score) {
    const MIN_SIZE = 12;
    const MAX_SIZE = 72;

    let normalised = (score + 1) / 2;
    let curved = Math.pow(normalised, 3);
    let fontSize = MIN_SIZE + curved * (MAX_SIZE - MIN_SIZE);

    return Math.round(fontSize);
  }
}