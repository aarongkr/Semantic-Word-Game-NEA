// Guess.js
// Holds one accepted guess in the  word cloud with its associated properties: text, size and physics state, used to move it each frame
class Guess {
    constructor(word, fontSize, isCorrect,  textLightness) {
      this.word = word;
      this.fontSize = fontSize;
      this.isCorrect = isCorrect; // only true when the guess is the secret word
      this.mass = (this.fontSize ** 1.5) / 250; // tune constant

      // spawn around a circle centred on middle, higher scoring words closer to centre
      let a = atan(tan(random(-PI / 2, PI / 2)) * (width / height) * 0.5) + (random() < 0.5 ? 0 : PI);
      let r = (72 - this.fontSize) * 6 // the 72 is the max font size, the other constant is tuneable
      this.pos = createVector(r*cos(a) + width/2, r*sin(a) + height/2);

      this.vel = createVector(0, 0);
      this.accel = createVector(0, 0);

      this.damping = 0.8; // per-frame velocity multiplier

      this.textLightness = textLightness;

      // only set once as font size doesn't change
      push();
        textSize(this.fontSize);
        this.width = textWidth(this.word) * 1.2;
        this.height = (textAscent() + textDescent()) * 1.2;
      pop();
    }

    update(netForce) {
      this.accel = netForce.div(this.mass); // a = F/m
      this.vel.add(this.accel);
      this.vel.mult(this.damping);
      this.pos.add(this.vel);
    }
}