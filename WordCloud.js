// WordCloud.js
// Owns every Guess currently in the cloud and runs the per-frame physics

class WordCloud {
  constructor() {
    this.guesses = []; // all Guess objects currently in the cloud
  }

  // Creates a Guess for an accepted word and adds it to the cloud
  addGuess(word, fontSize, isCorrect) {
    this.guesses.push(new Guess(word, fontSize, isCorrect, 25 + (random() - 0.5) * 15));
  }

  // Called once per frame: calculates the force on every guess, then lets each guess integrate that force into its own velocity and position.
  update() {
    const netForces = this.calculateNetForces();
    for (let i = 0; i < this.guesses.length; i++) {
      this.guesses[i].update(netForces[i]);
    }
  }

  // Returns the guesses so Renderer can draw them without owning them.
  getGuesses() {
    return this.guesses;
  }

  // Calculates the net force acting on each guess.
  calculateNetForces() {
    const centreX = width / 2;
    const centreY = height / 2;
    const springConstant = 0.001; // to tune
    const repulsionStrength = 0.25; // to tune, start low because masses are small

    const netForces = [];
    for (let i = 0; i < this.guesses.length; i++) {
      netForces.push(createVector(0, 0));
    }

    // centring force, proportional to distance from the centre
    for (let i = 0; i < this.guesses.length; i++) {
      netForces[i].x += (centreX - this.guesses[i].pos.x) * springConstant;
      netForces[i].y += (centreY - this.guesses[i].pos.y) * springConstant;
    }

    // repulsion force for every overlapping pair, each pair checked once
    for (let i = 0; i < this.guesses.length - 1; i++) {
      for (let j = i + 1; j < this.guesses.length; j++) {
        const overlapX = min(this.guesses[i].pos.x + this.guesses[i].width, this.guesses[j].pos.x + this.guesses[j].width) - max(this.guesses[i].pos.x, this.guesses[j].pos.x);
        const overlapY = min(this.guesses[i].pos.y + this.guesses[i].height, this.guesses[j].pos.y + this.guesses[j].height) - max(this.guesses[i].pos.y, this.guesses[j].pos.y);

        if (overlapX > 0 && overlapY > 0) {
          // separate along the axis with the shallowest overlap
          if (overlapX < overlapY) {
            const direction = this.guesses[i].pos.x > this.guesses[j].pos.x ? 1 : -1;
            const pushForce = overlapX * repulsionStrength;
            netForces[i].x += pushForce * direction;
            netForces[j].x -= pushForce * direction;
          } else {
            const direction = this.guesses[i].pos.y > this.guesses[j].pos.y ? 1 : -1;
            const pushForce = overlapY * repulsionStrength;
            netForces[i].y += pushForce * direction;
            netForces[j].y -= pushForce * direction;
          }
        }
      }
    }
    return netForces;
  }
}