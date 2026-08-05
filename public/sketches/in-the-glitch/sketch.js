let img;
let glitchLines = [];
let offsetY = 0;
function setup() {
  createCanvas(600, 900);
  img = createImage(width, height);

  // generate base pastel image
  img.loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = random(180, 255);
      let g = random(180, 255);
      let b = random(200, 255);
      img.set(x, y, color(r, g, b));
    }
  }
  img.updatePixels();

  // initialize glitch lines
  for (let i = 0; i < 5; i++) {
    glitchLines.push({
      y: random(height),
      speed: random(1, 3),
      thickness: random(2, 8),
      offset: random(-15, 15)
    });
  }
}
function draw() {
  // draw base image
  image(img, 0, 0);

  // apply gentle wave effect
  loadPixels();
  for (let y = 0; y < height; y++) {
    let wave = sin(frameCount * 0.02 + y * 0.01) * 2;
    for (let x = 0; x < width; x++) {
      let sourceX = x + wave;
      if (sourceX >= 0 && sourceX < width) {
        let destIndex = (x + y * width) * 4;
        let sourceIndex = (floor(sourceX) + y * width) * 4;

        pixels[destIndex] = pixels[sourceIndex];
        pixels[destIndex + 1] = pixels[sourceIndex + 1];
        pixels[destIndex + 2] = pixels[sourceIndex + 2];
        pixels[destIndex + 3] = 255;
      }
    }
  }
  updatePixels();

  // draw smooth glitch lines
  noStroke();
  glitchLines.forEach(line => {
    // update line position
    line.y += line.speed;
    if (line.y > height) line.y = -line.thickness;

    // draw glitch effect
    fill(255, 255, 255, 30);
    rect(0, line.y, width, line.thickness);

    // add slight horizontal offset
    push();
    translate(line.offset, 0);
    blend(get(0, line.y, width, line.thickness),
          0, line.y, width, line.thickness,
          0, line.y, width, line.thickness,
          OVERLAY);
    pop();
  });

  // add subtle scan lines
  for (let y = 0; y < height; y += 4) {
    stroke(0, 2);
    line(0, y, width, y);
  }
}
// add some interactivity
function mouseMoved() {
  // slightly modify glitch line positions based on mouse movement
  glitchLines.forEach(line => {
    line.offset = map(mouseX, 0, width, -20, 20);
  });
}
