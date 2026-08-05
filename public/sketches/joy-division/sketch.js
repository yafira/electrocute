let lines = [];
const numLines = 80;
const amplitude = 80;
const colors = ["#E6E6FA", "#FFD1DC", "#FFFACD"]; // lavender, pink, yellow
function setup() {
  createCanvas(800, 800);
  noFill();
  strokeWeight(1.4);

  // generate wave line data
  const spacing = height / (numLines + 8);
  const lineMargin = width * 0.10; // shortens the line by 15% on both sides
  for (let i = 0; i < numLines; i++) {
    let y = spacing * (i + 1);
    let points = [];

    // create points for each line
    for (let x = lineMargin; x < width - lineMargin; x += 4) {
      let yOffset = 0;
      if (x > width * 0.2 && x < width * 0.8) {
        let normalized = (x - width * 0.2) / (width * 0.6);
        let peak = sin(normalized * PI) * amplitude;
        yOffset = peak * noise(x * 0.01, i * 0.1);
      }
      points.push({
        x: x,
        y: y + yOffset
      });
    }

    // randomly assign properties to each line
    lines.push({
      points: points,
      isAnimated: random() < 0.3, // 30% chance to be animated
      color: random() < 0.2 ? random(colors) : '#FFFFFF' // 20% chance to be colored
    });
  }
}
function draw() {
  background(0);

  // draw each line
  for (let line of lines) {
    stroke(line.color);
    beginShape();
    for (let point of line.points) {
      let yOffset = 0;
      if (line.isAnimated) {
        yOffset = noise(point.x * 0.005 + frameCount * 0.01) * 8;
      }
      vertex(point.x, point.y + yOffset);
    }
    endShape();
  }
}
