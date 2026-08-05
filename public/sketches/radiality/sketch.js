let angleOffset = 0;
let radiusFactor = 0.95;  // factor to reduce radius for the spiral
let lineThickness = 0.5;  // initial stroke weight for line thickness
function setup() {
  createCanvas(800, 800);
  background(0);
  noFill();
  stroke(255);
  strokeWeight(lineThickness);  // set the line thickness
}
function draw() {
  background(0); // clear the background on each frame to allow animation
  drawSpiral(width / 2, height / 2, min(width, height) / 2, angleOffset);

  angleOffset += 0.01; // gradually increase the angle to animate the spiral's rotation
}
function drawSpiral(x, y, radius, angle) {
  if (radius > 2) {
    beginShape();
    for (let i = angle; i < angle + TWO_PI * 10; i += 0.05) {  // smaller angle step for smoother curves
      let px = x + cos(i) * radius;
      let py = y + sin(i) * radius;
      vertex(px, py);
    }
    endShape();
    drawSpiral(x, y, radius * radiusFactor, angle + 0.05);  // slightly rotate and shrink radius each time
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
