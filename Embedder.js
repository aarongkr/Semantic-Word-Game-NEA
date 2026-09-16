// Embedder.js
// Loads the MiniLM-L3 model via @huggingface/transformers and converts words
// into vector embeddings for semantic comparison.
class Embedder {
  constructor() {
    this.extractor = null; // the loaded feature-extraction pipeline, set by loadModel()
  }

  // Loads the quantised MiniLM-L3 model. Must be awaited before embed() is called. Uses a dynamic import() rather than a static import statement, since the p5 Web Editor runs tabs as classic scripts, not ES modules, and only dynamic import() is valid outside a module context.
  async loadModel() {
    const { pipeline } = await import(
      'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6'
    );
    this.extractor = await pipeline(
      'feature-extraction',
      'Xenova/paraphrase-MiniLM-L3-v2', { dtype: 'q8' }
    );
  }

  // Converts a single word into its vector embedding as a plain array.
  async embed(word) {
    const output = await this.extractor(word, { pooling: 'mean', normalize: true });
    return output.tolist()[0]; // tolist() wraps in an outer array even for one input
  }
}