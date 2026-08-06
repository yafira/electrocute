let cells = [];
let cellSize = 1;
let currentRow = 0;
function setup() {
  background(0);
  createCanvas(400, 400);

  let numberOfCells = width / cellSize;

  for (let i = 0; i < numberOfCells; i++) {
    cells.push(round(random()));

  }
  frameRate(30);
}
function draw() {
  let newCells = [];
  for (let i = 0; i < cells.length; i++) {
    if (cells[i - 1] == 1 && cells[i + 1] == 1) {
      newCells[i] = 0;
    } else if(cells[i - 1] == 1 || cells[i + 1] == 1) {
      newCells[i] = 1;
    } else {
      newCells[i] = 0;
    }
  }
  cells = newCells

  for (let i = 0; i < cells.length; i++) {
    noStroke();

    if (cells[i] == 0) {
    fill('black')

  } else if (cells[i] == 1) {
    fill('white');
  }
  rect(i * cellSize, currentRow * cellSize, cellSize, cellSize);

  }

currentRow++;
}
