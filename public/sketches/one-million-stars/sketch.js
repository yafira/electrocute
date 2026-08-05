let stars = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10000; i++) { // simulating one million stars using 10,000 bright points
    stars.push({
      x: random(width),
      y: random(height),
      z: random(width),
    });
  }
}
function draw() {
  background(0);
  noStroke();
  fill(255);
  for (let star of stars) {
    let sx = map(star.x / star.z, 0, 1, 0, width);
    let sy = map(star.y / star.z, 0, 1, 0, height);
    let r = map(star.z, 0, width, 8, 0.1);
    ellipse(sx, sy, r, r);
    star.z -= 2; // star moves closer to the screen
    if (star.z < 1) {
      star.z = width;
      star.x = random(width);
      star.y = random(height);
    }
  }
}
