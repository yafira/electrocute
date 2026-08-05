let radius = 200;
function setup() {
  createCanvas(800, 800);
  frameRate(30);
  noStroke();
}
function draw() {
  background(0);
  let currentTime = millis() / 1000;
  // slowed down the circle oscillation by dividing time by 4
  let oscillation = sin((currentTime/4) * TAU);
  let dynamicRadius = radius + oscillation * radius / 2;

  // create and apply gradient
  let gradient = drawingContext.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, dynamicRadius
  );

  let pink = color(255, 182, 193);
  let blue = color(173, 216, 230);
  let yellow = color(255, 255, 224);
  let lavender = color(220, 208, 255);

  gradient.addColorStop(0, pink.toString());
  gradient.addColorStop(0.6, blue.toString());
  gradient.addColorStop(1, yellow.toString());
  gradient.addColorStop(0.5, lavender.toString());

  drawingContext.fillStyle = gradient;
  ellipse(width / 2, height / 2, dynamicRadius * 2, dynamicRadius * 2);

  // add mathematical art pattern
  push();
  translate(width / 2, height / 2);
  stroke(0);
  noFill();

  beginShape();
  for (let angle = 0; angle < TAU; angle += TAU/100) {
    // parametric equations for a complex geometric pattern
    let r = dynamicRadius * cos(angle * 3 + currentTime * TAU);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);

  // add rotating spiral pattern
  beginShape();
  for (let angle = 0; angle < TAU; angle += TAU/100) {
    let spiralRadius = dynamicRadius * (0.5 + 0.3 * cos(angle * 5 + currentTime * TAU));
    let x = spiralRadius * cos(angle + currentTime * TAU);
    let y = spiralRadius * sin(angle + currentTime * TAU);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}
