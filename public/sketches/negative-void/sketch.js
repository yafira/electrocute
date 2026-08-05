function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  noLoop(); // prevent animation
}
function draw() {
  background(255);
  translate(width/2, height/2);

  // create multiple layers of static twisted squares
  for(let layer = 0; layer < 20; layer++) {
    push();

    // scale and rotate each layer with fixed angles
    let scaleFactor = map(layer, 0, 20, 1, 0.1);
    scale(scaleFactor);
    rotate(layer * 15); // fixed rotation based on layer

    // draw checkered pattern
    let squares = 12; // number of squares in each row/column
    let squareSize = width/squares;

    for(let y = -squares/2; y < squares/2; y++) {
      for(let x = -squares/2; x < squares/2; x++) {
        let xPos = x * squareSize;
        let yPos = y * squareSize;

        // create checkerboard pattern
        if((x + y) % 2 === 0) {
          fill(0);
        } else {
          fill(255);
        }

        noStroke();
        rect(xPos, yPos, squareSize, squareSize);
      }
    }

    pop();
  }

  // create dark center using gradual circles
  for(let i = 0; i < 50; i++) {
    let size = 100 - i * 2;
    let alpha = map(i, 0, 50, 255, 0);
    noStroke();
    fill(0, alpha);
    ellipse(0, 0, size);
  }
}
