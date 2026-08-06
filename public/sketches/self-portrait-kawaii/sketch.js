// kawaii portrait with switchable eyes + mouths
// eyes: up/down or q-t  |  mouth: left/right or 1-9

let MOUTH_STYLES = [
  "tiny-arc", // 1
  "mini-smile", // 2
  "mini-archUp", // 3
  "mini-archDown", // 4
  "tilde", // 5
  "wavy", // 6
  "cat", // 7
  "tongue", // 8
  "fangs", // 9
  "straight", // 10
  "smirk", // 11
];

// put kawaii eyes first so they're the default
let EYE_STYLES = [
  "kawaii", // q  (original drawKawaiiEye)
  "round-sparkle", // w
  "sleepy", // e
  "closed", // r
  "angry", // t
];

let mouthIndex = 6; // start on "cat"
let eyeIndex = 0; // start on "kawaii"

function setup() {
  createCanvas(450, 450);
  noLoop();
  render();
}

function mouseClicked() {
  // clicking cycles both eyes and mouth together, so every click gives
  // a clearly different face without needing to know the keyboard
  // shortcuts
  mouthIndex = (mouthIndex + 1) % MOUTH_STYLES.length;
  eyeIndex = (eyeIndex + 1) % EYE_STYLES.length;
  render();
}

function keyPressed() {
  // mouth cycling
  if (keyCode === RIGHT_ARROW) {
    mouthIndex = (mouthIndex + 1) % MOUTH_STYLES.length;
  } else if (keyCode === LEFT_ARROW) {
    mouthIndex = (mouthIndex - 1 + MOUTH_STYLES.length) % MOUTH_STYLES.length;
  } else if (key >= '1' && key <= '9') {
    const n = int(key) - 1;          // 1..9 -> 0..8
    if (n < MOUTH_STYLES.length) mouthIndex = n;
  } else if (key === '0') {
    mouthIndex = 9;                   // 10th: "straight"
  } else if (key === '-' || key === '_') {
    mouthIndex = 10;                  // 11th: "smirk"
  }
  // optional alternate keys in case '-' isn't convenient:
  else if (key === '[') { mouthIndex = 9; }   // straight
  else if (key === ']') { mouthIndex = 10; }  // smirk

  // eye cycling
  if (keyCode === UP_ARROW) {
    eyeIndex = (eyeIndex + 1) % EYE_STYLES.length;
  } else if (keyCode === DOWN_ARROW) {
    eyeIndex = (eyeIndex - 1 + EYE_STYLES.length) % EYE_STYLES.length;
  } else if (key === 'q' || key === 'Q') eyeIndex = 0;
  else if (key === 'w' || key === 'W') eyeIndex = 1;
  else if (key === 'e' || key === 'E') eyeIndex = 2;
  else if (key === 'r' || key === 'R') eyeIndex = 3;
  else if (key === 't' || key === 'T') eyeIndex = 4;

  render();
}


function render() {
  background(178, 164, 212); // soft lavender bg
  push();
  translate(width / 2 - 200, height / 2 - 220); // center the portrait

  // hair (behind head, wavy/curly)
  fill(0);
  noStroke();
  beginShape();
  vertex(120, 180);
  bezierVertex(105, 210, 125, 240, 135, 260);
  bezierVertex(115, 290, 135, 320, 145, 340);
  bezierVertex(125, 370, 140, 400, 155, 420);
  bezierVertex(135, 450, 160, 470, 175, 480);
  bezierVertex(190, 490, 210, 490, 225, 480);
  bezierVertex(240, 470, 265, 450, 245, 420);
  bezierVertex(260, 400, 275, 370, 255, 340);
  bezierVertex(265, 320, 285, 290, 265, 260);
  bezierVertex(275, 240, 295, 210, 280, 180);
  endShape(CLOSE);

  // face
  fill(224, 185, 149);
  ellipse(200, 220, 120, 160);

  // ears
  fill(224, 185, 149);
  ellipse(145, 220, 28, 38);
  ellipse(255, 220, 28, 38);

  // earrings
  drawCircuitEarring(135, 230, "0");
  drawCircuitEarring(265, 230, "1");

  // eyes (switchable; kawaii by default)
  drawEyes(170, 208, EYE_STYLES[eyeIndex]); // left
  drawEyes(230, 208, EYE_STYLES[eyeIndex]); // right

  // hair bangs
  fill(0);
  noStroke();
  arc(200, 182, 160, 120, PI, 0, CHORD);
  arc(200, 182, 60, 80, PI, 0, CHORD);
  arc(170, 182, 50, 80, PI, 0, CHORD);
  arc(230, 182, 50, 80, PI, 0, CHORD);

  // eyebrows (soft default; some styles adjust)
  drawBrows(EYE_STYLES[eyeIndex]);

  // nose
  stroke(0);
  strokeWeight(1.5);
  noFill();
  arc(200, 238, 12, 6, 0, PI, OPEN);

  // mouth (switchable)
  drawMouth(200, 268, MOUTH_STYLES[mouthIndex]);

  // blush
  noStroke();
  fill(255, 140, 170, 70);
  ellipse(160, 238, 26, 14);
  ellipse(240, 238, 26, 14);

  // neck + shirt
  noStroke();
  fill(224, 185, 149);
  rect(185, 285, 30, 65, 15, 15, 0, 0);
  fill(0);
  rect(140, 330, 120, 150);

  pop();
}

/* eyes + brows */
function drawEyes(x, y, style) {
  // y given is the eye center baseline used earlier (208)
  if (style === "kawaii") {
    drawKawaiiEye(x, y, 28); // original helper
    return;
  }

  let cx = x,
    cy = y;
  push();
  if (style === "round-sparkle") {
    noStroke();
    fill(255);
    ellipse(cx, cy, 28, 34); // sclera
    fill(20);
    ellipse(cx, cy + 2, 18, 24); // iris/pupil
    fill(0);
    ellipse(cx, cy + 4, 12, 16); // pupil core
    fill(255);
    ellipse(cx - 6, cy - 6, 6, 6);
    ellipse(cx + 5, cy + 4, 3, 3);
    noFill();
    stroke(40, 120);
    strokeWeight(1.6);
    arc(cx, cy + 10, 24, 10, 0, PI);
  } else if (style === "sleepy") {
    noFill();
    stroke(0);
    strokeWeight(3);
    arc(cx, cy - 2, 30, 16, PI, TWO_PI);
    noStroke();
    fill(30);
    ellipse(cx, cy + 6, 14, 10);
    fill(255);
    ellipse(cx - 3, cy + 3, 3, 3);
  } else if (style === "closed") {
    noFill();
    stroke(0);
    strokeCap(ROUND);
    strokeWeight(3.5);
    arc(cx, cy, 28, 14, PI, TWO_PI);
    line(cx - 12, cy - 2, cx - 16, cy - 6);
    line(cx + 12, cy - 2, cx + 16, cy - 6);
  } else if (style === "angry") {
    noStroke();
    fill(255);
    ellipse(cx, cy + 2, 26, 30);
    fill(178, 164, 212);
    quad(cx - 18, cy - 6, cx + 18, cy - 12, cx + 18, cy - 2, cx - 18, cy + 4);
    fill(25);
    ellipse(cx, cy + 8, 14, 18);
    fill(0);
    ellipse(cx, cy + 10, 8, 12);
    fill(255);
    ellipse(cx - 4, cy + 4, 3, 3);
  }
  pop();
}

function drawBrows(style) {
  noFill();
  stroke(0);
  strokeCap(ROUND);
  if (style === "angry") {
    strokeWeight(7);
    line(150, 186, 175, 180);
    line(225, 180, 250, 186);
  } else if (style === "sleepy") {
    strokeWeight(6);
    line(145, 188, 175, 186);
    line(225, 186, 255, 188);
  } else if (style === "closed") {
    strokeWeight(6);
    arc(160, 186, 36, 14, PI + 0.2, TWO_PI - 0.2);
    arc(240, 186, 36, 14, PI + 0.2, TWO_PI - 0.2);
  } else {
    strokeWeight(6);
    line(145, 186, 175, 186);
    line(225, 186, 255, 186);
  }
}

// kawaii eye helper
function drawKawaiiEye(x, y, s, outer = "auto") {
  // white
  noStroke(); fill(255);
  ellipse(x, y, s + 4, s);

  // iris + pupil
  fill(30); ellipse(x, y + 1, s - 2, s - 4);
  fill(0);  ellipse(x, y + 2, s - 10, s - 12);

  // highlights
  fill(255);
  ellipse(x - 5, y - 4, 6, 6);
  ellipse(x + 4, y + 3, 3, 3);

  // top liner
  noFill(); stroke(0); strokeWeight(2);
  arc(x, y - 1, s + 6, s - 6, PI, TWO_PI);

  // outer lashes
  if (outer === "auto") outer = (x < 200) ? "left" : "right"; // 200 approx face center in these coords
  if (outer === "left") {
    line(x - (s * 0.5), y - 6, x - (s * 0.62), y - 11);
  } else if (outer === "right") {
    line(x + (s * 0.5), y - 6, x + (s * 0.62), y - 11);
  }
}

/* mouths */
function drawMouth(cx, cy, style) {
  push();
  stroke(0);
  strokeWeight(2);
  noFill();

  if (style === "tiny-arc") {
    arc(cx, cy, 12, 6, 0.1, PI - 0.1);
  } else if (style === "mini-smile") {
    arc(cx, cy, 28, 10, 0.2, PI - 0.2);
  } else if (style === "mini-archUp") {
    line(cx - 6, cy + 2, cx, cy - 3);
    line(cx, cy - 3, cx + 6, cy + 2);
  } else if (style === "mini-archDown") {
    line(cx - 6, cy - 2, cx, cy + 3);
    line(cx, cy + 3, cx + 6, cy - 2);
  } else if (style === "tilde") {
    beginShape();
    vertex(cx - 16, cy);
    bezierVertex(cx - 8, cy + 6, cx + 8, cy - 6, cx + 16, cy);
    endShape();
  } else if (style === "wavy") {
    beginShape();
    vertex(cx - 20, cy);
    bezierVertex(cx - 12, cy + 6, cx - 4, cy - 6, cx + 4, cy);
    bezierVertex(cx + 12, cy + 6, cx + 20, cy - 6, cx + 28, cy);
    endShape();
  } else if (style === "cat") {
    beginShape();
    vertex(cx - 18, cy);
    quadraticVertex(cx - 6, cy + 9, cx, cy);
    quadraticVertex(cx + 6, cy + 9, cx + 18, cy);
    endShape();
  } else if (style === "tongue") {
    arc(cx, cy + 2, 30, 16, 0, PI);
    noStroke();
    fill(0);
    arc(cx, cy + 2, 28, 14, 0, PI, CHORD);
    fill(255, 140, 160);
    arc(cx + 6, cy + 5, 12, 8, 0, PI, CHORD);
    stroke(255, 140);
    strokeWeight(1);
    noFill();
    line(cx - 8, cy - 1, cx - 2, cy - 3);
  } else if (style === "fangs") {
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(cx, cy + 1, 30, 12, 0.1, PI - 0.1);
    noStroke();
    fill(255);
    triangle(cx - 6, cy + 1, cx - 2, cy + 1, cx - 4, cy + 7);
    triangle(cx + 2, cy + 1, cx + 6, cy + 1, cx + 4, cy + 7);
    stroke(0);
    noFill();
    strokeWeight(2);
    line(cx - 15, cy + 1, cx - 7, cy + 1);
    line(cx + 7, cy + 1, cx + 15, cy + 1);
  } else if (style === "straight") {
    // neutral flat mouth
    line(cx - 12, cy, cx + 12, cy);
  } else if (style === "smirk") {
    // asymmetrical - flat on one side, curve up at the other
    noFill();
    beginShape();
    vertex(cx - 12, cy); // start flat left
    vertex(cx, cy); // middle flat
    quadraticVertex(cx + 10, cy - 6, cx + 14, cy); // curve upward on right
    endShape();
  }
  pop();
}

/* earrings */
function drawCircuitEarring(anchorX, anchorY, digit) {
  noFill();
  stroke(140);
  strokeWeight(1);
  ellipse(anchorX, anchorY, 3, 3);

  rectMode(CENTER);
  stroke(255, 255, 255, 140);
  strokeWeight(1);
  fill(60, 150, 110);
  rect(anchorX, anchorY + 8, 12, 16, 2.5);

  noStroke();
  fill(235, 190, 70);
  rect(anchorX - 3, anchorY + 12.8, 2, 2.6, 0.8);
  rect(anchorX + 1, anchorY + 12.8, 2, 2.6, 0.8);

  fill(38);
  rect(anchorX, anchorY + 5, 7, 5, 1);

  stroke(235, 190, 70);
  strokeWeight(0.9);
  line(anchorX - 4.8, anchorY + 5, anchorX - 3.6, anchorY + 5);
  line(anchorX + 3.6, anchorY + 5, anchorX + 4.8, anchorY + 5);

  stroke(235, 190, 70);
  strokeWeight(1);
  line(anchorX - 3.6, anchorY + 5, anchorX - 3.6, anchorY + 11);
  line(anchorX - 3.6, anchorY + 11, anchorX - 3, anchorY + 11);
  line(anchorX - 3, anchorY + 11, anchorX - 3, anchorY + 12.8);

  noFill();
  stroke(250);
  strokeWeight(0.9);
  ellipse(anchorX + 2.6, anchorY + 10.2, 1.4, 1.4);

  // diode silkscreen (triangle + bar)
  noFill();
  stroke(255);
  strokeWeight(0.7);
  beginShape();
  vertex(anchorX - 2.0, anchorY + 12.6);
  vertex(anchorX - 2.0, anchorY + 14.2);
  vertex(anchorX + 0.2, anchorY + 13.4);
  endShape(CLOSE);
  line(anchorX + 0.6, anchorY + 12.6, anchorX + 0.6, anchorY + 14.2);

  noStroke();
  textAlign(CENTER, CENTER);
  textSize(6);
  fill(0);
  text(digit, anchorX, anchorY + 8);

  rectMode(CORNER);
  noStroke();
}
