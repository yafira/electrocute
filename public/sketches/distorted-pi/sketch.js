const PI = 4;
function setup() {
  createCanvas(800, 800);
  noLoop();
  colorMode(HSL, 360, 100, 100); // use HSL for easy pastel color creation
  noStroke();
}
function draw() {
  background(210, 80, 90); // pastel lavender background
  translate(width / 2, height / 2); // center the shapes
  // draw concentric shapes with distorted circular patterns
  for (let r = 250; r > 0; r -= 30) {
    let distortion = map(r, 250, 0, 0, PI); // increase distortion as radius decreases
    fill(random(180, 360), 70, 90); // generate pastel hues
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      // distorted circle
      let x = (r + cos(a * distortion) * 20) * cos(a);
      let y = (r + sin(a * distortion) * 20) * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  // add a central element for focus
  fill(50, 70, 90); // soft pastel yellow
  ellipse(0, 0, 50, 50); // small central circle
}
