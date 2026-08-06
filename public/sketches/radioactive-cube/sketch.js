// pastel color palette
const pastelColors = [
  [224, 187, 228], // lilac
  [255, 209, 220], // pink
  [253, 253, 150], // yellow
  [173, 216, 230], // blue
  [144, 238, 144]  // green
];
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}
function draw() {
  background(0); // light gray background for contrast
  // calculate position to center the cube
  let x = width / 2;
  let y = height / 2;

  push();
  translate(x, y);

  // size the cube relative to the canvas instead of a fixed pixel
  // value, so it looks right whether this is a small tile or a large
  // fullscreen view
  let cubeSize = min(width, height) * 0.55;
  let animatedSize = cubeSize + sin(frameCount * 0.01) * (cubeSize * 0.1);
  drawIsometricCube(animatedSize);
  pop();
}
function drawIsometricCube(size) {
  let halfSize = size / 2;
  // randomize the color for each cube face
  fill(random(pastelColors));
  // top face (isosceles triangle)
  beginShape();
  vertex(0, -halfSize);
  vertex(halfSize, -halfSize / 2);
  vertex(0, 0);
  vertex(-halfSize, -halfSize / 2);
  endShape(CLOSE);

  // right face
  fill(random(pastelColors));
  beginShape();
  vertex(0, 0);
  vertex(halfSize, -halfSize / 2);
  vertex(halfSize, halfSize / 2);
  vertex(0, halfSize);
  endShape(CLOSE);

  // left face
  fill(random(pastelColors));
  beginShape();
  vertex(0, 0);
  vertex(-halfSize, -halfSize / 2);
  vertex(-halfSize, halfSize / 2);
  vertex(0, halfSize);
  endShape(CLOSE);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // adjust the canvas size on window resize
}
