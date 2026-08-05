let glitchNoise;
function setup() {
  createCanvas(800, 800);
  glitchNoise = createGraphics(400, 300);  // increase the size of the screen content
  frameRate(30);
}
function draw() {
  background(0);
  // draw the antenna
  drawAntenna();
  // draw the tv body
  stroke(0);
  strokeWeight(4);
  let tvX = width / 2 - 220;  // center the tv horizontally
  let tvY = height / 2 - 170; // center the tv vertically
  rect(tvX, tvY, 440, 340, 20);  // larger rounded rectangle for the tv
  // tv outer border
  fill(100);
  rect(tvX - 10, tvY - 10, 460, 360, 25);
  // draw tv knobs
  fill(70);
  ellipse(tvX + 430, tvY + 80, 30, 30);  // top knob
  ellipse(tvX + 430, tvY + 140, 30, 30); // middle knob
  ellipse(tvX + 430, tvY + 200, 30, 30); // bottom knob

  // draw the glitchy screen (larger size)
  glitchEffect();
  image(glitchNoise, tvX + 20, tvY + 20);
  // draw scanlines over the screen
  drawScanlines(tvX + 20, tvY + 20, 400, 300);
}
// function to create the glitch effect
function glitchEffect() {
  glitchNoise.loadPixels();
  for (let y = 0; y < glitchNoise.height; y++) {
    for (let x = 0; x < glitchNoise.width; x++) {
      // random noise to simulate glitch (black and white)
      let glitchColor = random() < 0.5 ? color(0) : color(255); // black or white
      glitchNoise.set(x, y, glitchColor);
    }
  }
  glitchNoise.updatePixels();
}
// function to draw crt scanlines
function drawScanlines(x, y, w, h) {
  stroke(0, 100);  // transparent black for scanlines
  strokeWeight(1);
  for (let i = y; i < y + h; i += 3) {
    line(x, i, x + w, i);
  }
}
// function to draw antenna
function drawAntenna() {
  stroke(150);
  strokeWeight(4);

  // antenna base lines
  let baseX = width / 2 - 60;
  let baseY = height / 2 - 180;

  // left antenna
  line(baseX, baseY, baseX - 100, baseY - 150);  // angled line for left antenna

  // right antenna
  line(baseX + 120, baseY, baseX + 220, baseY - 150);  // angled line for right antenna
  // antenna circles at the tips
  fill(200);
  noStroke();
  ellipse(baseX - 100, baseY - 150, 10, 10);  // tip of left antenna
  ellipse(baseX + 220, baseY - 150, 10, 10);  // tip of right antenna
}
