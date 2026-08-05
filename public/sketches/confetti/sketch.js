function setup() {
  createCanvas(800, 800);
  noStroke();
}
function draw() {
  background(255, 255, 255, 20); // slight fade effect for smooth animation
  for (let i = 0; i < 10; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-50, 50);
    let y2 = y1 + random(-50, 50);
    let x3 = x1 + random(-50, 50);
    let y3 = y1 + random(-50, 50);
    fill(randomPastelColor());
    triangle(x1, y1, x2, y2, x3, y3);
  }
}
function randomPastelColor() {
  let r = random(150, 255);
  let g = random(150, 255);
  let b = random(150, 255);
  return color(r, g, b, 200); // slight transparency for softness
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
