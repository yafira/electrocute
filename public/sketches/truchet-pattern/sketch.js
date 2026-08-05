const tileSize = 20;
const cols = 30;
const rows = 30;
// pastel color palette
let palette = ['#A6E1FA', '#FFCCD2', '#E7EAB5', '#D4C2FC', '#FBE5A6', 'black'];
function setup() {
  createCanvas(cols * tileSize, rows * tileSize);
  noLoop();
}
function draw() {
  background('#FAFAFA');  // bg
  strokeWeight(1);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cx = x * tileSize;
      let cy = y * tileSize;
      push();
      translate(cx + tileSize / 2, cy + tileSize / 2);
      // random pastel color
      stroke(random(palette));
      // randomly rotate
      if (random() < 0.5) rotate(HALF_PI);
      // truchet arcs
      noFill();
      arc(-tileSize/2, -tileSize/2, tileSize, tileSize, 0, HALF_PI);
      arc(tileSize/2, tileSize/2, tileSize, tileSize, PI, PI+HALF_PI);
      pop();
    }
  }
}
