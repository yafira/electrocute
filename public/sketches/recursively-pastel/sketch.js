function setup() {
  createCanvas(800, 800);
  noLoop();
  noStroke();
}
function draw() {
  background(255); // set the background to white
  // number of rows and columns for subdivision
  const rows = 10;
  const cols = 10;
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = col * cellWidth;
      let y = row * cellHeight;
      let baseColor;
      // randomly assign pastel colors or black and white
      if (random() < 0.3) {
        baseColor = color(random(200, 255), random(150, 255), random(200, 255)); // pastel
      } else {
        baseColor = random([0, 255]); // black or white
      }
      // subdivide cells further into shapes
      push();
      translate(x, y);
      fill(baseColor);
      rect(0, 0, cellWidth, cellHeight);
      // black outline
      stroke(0);
      strokeWeight(2);
      noFill();
      rect(0, 0, cellWidth, cellHeight);
      // add smaller shapes inside each cell
      fill(baseColor);
      noStroke();
      let centerX = cellWidth / 2;
      let centerY = cellHeight / 2;
      let currentSize = min(cellWidth, cellHeight) / 2;
      // draw random shapes
      let shapeType = int(random(3));
      if (shapeType === 0) {
        ellipse(centerX, centerY, currentSize, currentSize);
      } else if (shapeType === 1) {
        rect(centerX - currentSize / 2, centerY - currentSize / 2, currentSize, currentSize);
      } else {
        triangle(
          centerX,
          centerY - currentSize / 2,
          centerX - currentSize / 2,
          centerY + currentSize / 2,
          centerX + currentSize / 2,
          centerY + currentSize / 2
        );
      }
      pop();
    }
  }
  // add recursive black, white, and pastel squares in the center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;
  const initialSize = 200; // initial size of the largest square
  drawRecursiveSquares(centerX, centerY, initialSize, 5);
}
// recursive function to draw squares
function drawRecursiveSquares(x, y, currentSize, depth) {
  if (depth <= 0) return; // stop recursion if depth is 0
  // alternate between pastel and black/white
  let fillColor;
  if (random() < 0.3) {
    fillColor = color(random(200, 255), random(150, 255), random(200, 255)); // pastel
  } else {
    fillColor = depth % 2 === 0 ? 0 : 255; // black or white
  }
  fill(fillColor);
  rectMode(CENTER);
  rect(x, y, currentSize, currentSize);
  // call the function recursively to draw smaller squares
  const newSize = currentSize / 2;
  drawRecursiveSquares(x, y, newSize, depth - 1);
}
