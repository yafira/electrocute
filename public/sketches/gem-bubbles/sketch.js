let shapes = [];
function setup() {
  createCanvas(800, 800);
  noStroke();
  // generate initial shapes
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(50, 150),
      color: randomColor(),
      speedX: random(-0.3, 0.3), // reduced speed for slower motion
      speedY: random(-0.3, 0.3),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.005, 0.005) // slower rotation
    });
  }
}
function draw() {
  background(245, 245, 245);
  for (let shape of shapes) {
    drawKlintShape(shape);
    updateShape(shape);
  }
}
function drawKlintShape(shape) {
  push();
  translate(shape.x, shape.y);
  rotate(shape.rotation);
  // draw layered pastel shapes
  for (let i = 0; i < 5; i++) {
    fill(lerpColor(color(shape.color), color(255), i / 5));
    ellipse(0, 0, shape.size * (1 - i * 0.2));
  }
  // add symbolic inner elements
  fill(randomColor());
  ellipse(0, 0, shape.size * 0.4);
  fill(randomColor());
  rectMode(CENTER);
  rect(0, 0, shape.size * 0.2, shape.size * 0.2);
  pop();
}
function updateShape(shape) {
  // move shapes
  shape.x += shape.speedX;
  shape.y += shape.speedY;
  // wrap around screen edges
  if (shape.x > width) shape.x = 0;
  if (shape.x < 0) shape.x = width;
  if (shape.y > height) shape.y = 0;
  if (shape.y < 0) shape.y = height;
  // rotate shapes
  shape.rotation += shape.rotationSpeed;
}
function randomColor() {
  const palette = [
    color(232, 215, 241), // pastel lavender
    color(241, 231, 203), // pastel yellow
    color(244, 203, 215), // soft pink
    color(200, 234, 221), // mint green
    color(233, 242, 254)  // light blue
  ];
  return palette[floor(random(palette.length))];
}
