let colors = []; // empty array
const maxSquares = 100;  // total number of squares
let size = 5;  // starting size of the squares
const growthRate = 30;  // rate at which squares grow
let clickToggle = false;  // toggle state for mouse press
function setup() {
  createCanvas(800, 800);  // set up canvas size
  generateColors();  // initialize colors
}
function draw() {
  background(0);  // set background to black
  translate(width / 2, height / 2);  // move origin to canvas center
  let currentSize = size;  // initialize current square size
  // loop to draw squares
  for (let i = 0; i < maxSquares; i++) {
    fill(clickToggle ? colors[i] : color(0, 0, 0, 0));  // fill squares on click, else no fill
    stroke(colors[i]);  // apply stroke color
    strokeWeight(2);  // set stroke thickness
    rectMode(CENTER);  // draw squares from center
    rect(0, 0, currentSize, currentSize);  // draw square
    currentSize *= 0.9;  // reduce size for next square
  }
  size += growthRate;  // gradually grow squares
}
function generateColors() {
  colors = [];
  // generate pastel gradient colors
  for (let i = 0; i < maxSquares; i++) {
    let r = map(i, 0, maxSquares, 255, 200);  // map red values
    let g = map(i, 0, maxSquares, 220, 255);  // map green values
    let b = map(i, 0, maxSquares, 255, 240);  // map blue values
    colors.push(color(r, g, b));  // add color to array
  }
}
function mousePressed() {
  clickToggle = !clickToggle;  // toggle on mouse press

  if (clickToggle) {
    // change colors on click
    colors = colors.map(() => color(random(200, 255), random(200, 255), random(220, 255)));
  } else {
    // revert to original gradient
    generateColors();
  }
}
