let angle = 0;

function setup() {
  createCanvas(800, 800);
  background(245); // light beige background
  // noLoop();
  // set default stroke settings
  strokeWeight(0.8);
  stroke(0);
}

function draw() {
  background(245);

  // original shapes
  drawShapes();
  drawLines();
  drawPatterns();

  // additional elements
  drawExtraElements();
}

function drawExtraElements() {
  // add three thick wavy strokes
  drawThickWaves();

  // draw curved lines
  stroke(0);
  strokeWeight(2);
  noFill();
  beginShape();
  curveVertex(150, 600);
  curveVertex(150, 600);
  curveVertex(200, 550);
  curveVertex(250, 580);
  curveVertex(300, 550);
  curveVertex(300, 550);
  endShape();

  // draw crossing lines with rotation
  push();
  translate(450, 400);
  rotate(PI / 4);
  for (let i = 0; i < 5; i++) {
    line(-50, i * 10, 50, i * 10);
  }
  pop();

  // draw geometric shapes with patterns
  push();
  translate(600, 200);
  rotate(PI / 6);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0) {
        fill(0);
      } else {
        fill(255);
      }
      rect(i * 10, j * 10, 10, 10);
    }
  }
  pop();

  // add floating elements
  noFill();
  circle(350, 150, 20);
  circle(370, 150, 20);

  // abstract shape with dots
  push();
  translate(600, 600);
  rotate(-PI / 3);
  beginShape();
  vertex(0, 0);
  vertex(30, -20);
  vertex(40, 0);
  vertex(20, 20);
  endShape(CLOSE);

  // add dots
  fill(0);
  for (let i = 0; i < 5; i++) {
    circle(random(0, 40), random(-20, 20), 3);
  }
  pop();
}

function drawThickWaves() {
  // first wave - top right corner
  push();
  strokeWeight(4);
  noFill();
  beginShape();
  for (let x = width / 2; x <= width - 100; x += width / 16) {
    let y = (x / 2) + 20 * sin(x / 50);
    curveVertex(x, y);
  }
  endShape();
  pop();

  // second wave - middle right area
  push();
  strokeWeight(3);
  noFill();
  beginShape();
  for (let x = width / 2 + 50; x <= width - 80; x += width / 16) {
    let y = (x / 2) + 150 + 25 * sin(x / 40);
    curveVertex(x, y);
  }
  endShape();
  pop();

  // third wave - bottom right
  push();
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = width / 2 + 100; x <= width - 60; x += width / 16) {
    let y = (x / 2) + 250 + 15 * sin(x / 60 + PI / 4);
    curveVertex(x, y);
  }
  endShape();
  pop();
}

function drawShapes() {
  // large circle
  drawCircle(width * 0.3, height * 0.3, 200);

  // medium circle with gradient
  drawGradientCircle(width * 0.7, height * 0.4, 100);

  // small nested circles
  drawNestedCircles(width * 0.7, height * 0.7, 50);

  // solid black circle inside the larger circle with animation
  let centerX = width * 0.3;
  let centerY = height * 0.3;
  let animatedRadius = 50 + 10 * sin(angle);
  fill(0);
  ellipse(centerX, centerY, animatedRadius * 2, animatedRadius * 2);
  angle += 0.05;
}

function drawGradientCircle(x, y, d) {
  push();
  noStroke();
  let radius = d / 2;

  // create gradient effect
  for (let r = radius; r > 0; r--) {
    let inter = map(r, 0, radius, 0, 1);

    // interpolate between pastel colors
    // pastel blue -> lavender -> pastel pink
    let firstColor = lerpColor(
      color(184, 218, 255),
      color(230, 208, 255),
      inter
    );

    let secondColor = lerpColor(
      color(230, 208, 255),
      color(255, 208, 234),
      inter
    );

    let finalColor = lerpColor(firstColor, secondColor, inter);

    fill(finalColor);
    circle(x, y, r * 2);
  }
  pop();
}

function drawLines() {
  // thin lines
  drawLine(width * 0.1, height * 0.2, width * 0.9, height * 0.4);
  drawLine(width * 0.3, height * 0.1, width * 0.5, height * 0.9);
  // thick line
  strokeWeight(4);
  drawLine(width * 0.2, height * 0.5, width * 0.7, height * 0.5);
}

function drawPatterns() {
  // grid
  drawGrid(width * 0.5, height * 0.6, 40, 40);
  // cross
  drawCross(width * 0.4, height * 0.4, 80, 80);
  // diagonal lines
  strokeWeight(2);
  drawDiagonalLines(width * 0.2, height * 0.8, 120);
  // star
  drawStar(width * 0.6, height * 0.2, 50, 25, 5);
}

function drawCircle(x, y, d) {
  ellipse(x, y, d, d);
}

function drawNestedCircles(x, y, d) {
  for (let i = 0; i < 3; i++) {
    ellipse(x, y, d - i * 10, d - i * 10);
  }
}

function drawLine(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
}

function drawGrid(x, y, w, h) {
  for (let i = 0; i <= 4; i++) {
    line(x, y + i * (h / 4), x + w, y + i * (h / 4));
    line(x + i * (w / 4), y, x + i * (w / 4), y + h);
  }
}

function drawCross(x, y, w, h) {
  line(x - w / 2, y, x + w / 2, y);
  line(x, y - h / 2, x, y + h / 2);
}

function drawDiagonalLines(x, y, length) {
  for (let i = 0; i < 4; i++) {
    line(x + i * 10, y - i * 10, x + length + i * 10, y + length - i * 10);
  }
}

function drawStar(x, y, radius1, radius2, npoints) {
  fill(255, 250, 180); // pastel yellow
  stroke(2);
  let angleStep = TWO_PI / npoints;
  let halfAngle = angleStep / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angleStep) {
    let sx = x + cos(a) * radius1;
    let sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mousePressed() {
  redraw();
  // slightly vary the composition each time
  angle += 0.1;
}
