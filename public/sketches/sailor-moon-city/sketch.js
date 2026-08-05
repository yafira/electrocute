function setup() {
  createCanvas(800, 800);
  noLoop();
}
function draw() {
  // black background
  background('#000000');

  // lighter pastel moon
  noStroke();
  fill(255, 245, 245, 230); // very light pink
  circle(width/2, height/4, 60);

  // generate buildings
  let buildingWidth = 40;
  let numBuildings = width / buildingWidth + 1;
  let maxHeight = height * 0.6;
  let minHeight = height * 0.3;

  // lighter pastel building colors
  let buildingColors = [
    color(255, 240, 245, 220), // lavender blush
    color(240, 255, 255, 220), // azure
    color(255, 250, 240, 220), // floral white
    color(245, 255, 250, 220), // mint cream
    color(255, 245, 238, 220), // seashell
    color(240, 248, 255, 220)  // alice blue
  ];

  for (let i = 0; i < numBuildings; i++) {
    let x = i * buildingWidth;
    let buildingHeight = random(minHeight, maxHeight);
    let y = height - buildingHeight;

    // draw building
    fill(random(buildingColors));
    noStroke();
    rect(x, y, buildingWidth - 2, buildingHeight);

    // add windows
    let windowSpacing = 25;
    let windowWidth = 8;
    let windowHeight = 12;

    // calculate number of windows that can fit
    let numRows = floor((buildingHeight - 20) / windowSpacing);
    let numCols = floor((buildingWidth - 10) / windowSpacing);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        // random chance for light to be on
        if (random() < 0.7) {
          fill(255, 255, 150, 50); // warm light
          rect(x + 8 + (col * windowSpacing),
               y + 15 + (row * windowSpacing),
               windowWidth, windowHeight);
        } else {
          fill(255, 255, 255, 20); // dark window
          rect(x + 8 + (col * windowSpacing),
               y + 15 + (row * windowSpacing),
               windowWidth, windowHeight);
        }
      }
    }
  }

  // add stars
  for (let i = 0; i < 70; i++) {
    fill(255, random(100, 200));
    noStroke();
    let starSize = random(1, 2);
    circle(random(width), random(height/2), starSize);
  }

  // add subtle glow to moon
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = 'rgba(255, 255, 255, 0.3)';
  circle(width/2, height/4, 62);
  drawingContext.shadowBlur = 0;
}
function mousePressed() {
  // generate new skyline on click
  redraw();
}
