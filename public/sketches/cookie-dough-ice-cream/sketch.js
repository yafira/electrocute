// programming design systems, shapes / ice cream exercise
function setup() {
  createCanvas(600, 800);
  noLoop();
  background(255);
  stroke(0);
  strokeJoin(ROUND);
  strokeCap(ROUND);
}
function draw() {
  translate(width / 2, height * 0.5);
  const outline = 20;   // thick outline
  const scoopR  = 135;  // scoop radius
  // waffle cone (flat rim, no scallops)
  drawWaffleCone(0, 0, 200, 300, outline);
  // scoop outline
  noFill();
  strokeWeight(outline);
  ellipse(0, -scoopR + 20, scoopR * 2, scoopR * 2);
  // cookie dough chocolate chips & bigger chunks
  drawChocoChips(0, -scoopR + 20, scoopR * 0.9, 40);
}
// waffle cone with flat rim and cross-hatch pattern
function drawWaffleCone(cx, cy, widthTop, heightCone, outline) {
  push();
  translate(cx, cy);
  const x1 = -widthTop / 2, y1 = 0;
  const x2 =  widthTop / 2,  y2 = 0;
  const x3 =  0,             y3 = heightCone;
  // cone outline
  noFill();
  strokeWeight(outline);
  triangle(x1, y1, x2, y2, x3, y3);
  // waffle cross-hatch pattern
  const sw = max(1.5, outline * 0.12);
  strokeWeight(sw);
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(x1, y1);
  drawingContext.lineTo(x2, y2);
  drawingContext.lineTo(x3, y3);
  drawingContext.closePath();
  drawingContext.clip();
  const spacing = 16;
  const pad = widthTop * 1.2;
  // two diagonal directions for waffle texture
  for (let d = -widthTop; d <= widthTop + heightCone; d += spacing) {
    line(-pad, d, pad, d - widthTop);
  }
  for (let d = -widthTop; d <= widthTop + heightCone; d += spacing) {
    line(pad, d, -pad, d - widthTop);
  }
  drawingContext.restore();
  // flat rim line
  strokeWeight(outline);
  line(x1, y1, x2, y2);
  pop();
}
// chocolate chips/chunks inside the scoop
function drawChocoChips(cx, cy, radius, count) {
  push();
  fill(0);
  for (let i = 0; i < count; i++) {
    const r = random(radius * 0.2, radius);
    const a = random(TWO_PI);
    const x = cx + r * cos(a);
    const y = cy + r * sin(a);
    if (dist(cx, cy, x, y) > radius * 0.9) continue;
    push();
    translate(x, y);
    rotate(random(TWO_PI));
    // 35% chance of a large "chunk"
    if (random() < 0.35) {
      stroke(0);
      strokeWeight(3);
      fill(0);
      const sides = floor(random(5, 8)); // more irregular
      const w = random(20, 40);
      const h = random(16, 28);
      beginShape();
      for (let j = 0; j < sides; j++) {
        const ang = j * TWO_PI / sides + random(-0.3, 0.3);
        const rad = (w / 2) * random(0.6, 1);
        vertex(rad * cos(ang), rad * sin(ang) * (h / w));
      }
      endShape(CLOSE);
    } else {
      // small chip
      noStroke();
      const w = random(6, 12);
      const h = random(4, 8);
      ellipse(0, 0, w, h);
    }
    pop();
  }
  pop();
}
