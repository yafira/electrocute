let colors = [];
let numRects = 6; // number of rectangles
function setup() {
  createCanvas(800, 800);
  noStroke(); // no outline for rectangles
  frameRate(2); // set the frame rate to 2 frames per second for slower speed
  // define pastel colors with a wider variety
  colors = [
    color(255, 182, 193), // pastel pink
    color(173, 216, 230), // pastel blue
    color(255, 240, 245), // pastel purple
    color(240, 255, 240), // pastel green
    color(255, 255, 204), // pastel yellow
    color(255, 218, 185), // pastel peach
    color(204, 204, 255), // light lavender
    color(255, 228, 225), // pastel coral
  ];
}
function draw() {
  background(255); // white background
  for (let i = 0; i < numRects; i++) {
    // randomly choose the position and size of the rectangle
    let x = random(width);
    let y = random(height);
    let w = random(200, 600); // increased random width
    let h = random(200, 600); // increased random height
    // make sure the rectangle stays within the canvas boundaries
    if (x + w > width) w = width - x;
    if (y + h > height) h = height - y;
    // randomly choose a color, favoring pastel colors
    let c = random() < 0.9 ? random(colors) : color(255); // 90% chance for pastel color, 10% for white
    fill(c);
    rect(x, y, w, h);  // draw the rectangle
  }
  // draw the black grid lines
  stroke(0);
  strokeWeight(8); // increased stroke weight for bolder lines

  // draw some vertical and horizontal lines
  for (let i = 0; i < width; i += random(150, 300)) {
    line(i, 0, i, height); // vertical lines
  }
  for (let j = 0; j < height; j += random(150, 300)) {
    line(0, j, width, j); // horizontal lines
  }
}
