// high-contrast binary smiley for plotter clarity
let cols = 90;
let rows = 88;
let pBg   = 0.48;  // balanced noise background
let pFace = 0.92;  // strong bias for face features
function setup() {
  createCanvas(1000, 1000);
  background(0);
  textAlign(CENTER, CENTER);
  textSize(width / cols * 1.15);
  textFont('monospace');
  drawBinarySmileyClear();
  noLoop();
}
function drawBinarySmileyClear() {
  let cellW = width / cols;
  let cellH = height / rows;
  let cx = cols / 2;
  let cy = rows / 2;
  let faceR  = cols * 0.38;
  let eyeR   = faceR * 0.14;
  let mouthR = faceR * 0.60;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let gx = i - cx;
      let gy = j - cy;
      let d  = sqrt(gx * gx + gy * gy);
      // strong face outline
      let onFaceOutline = d > faceR * 0.85 && d < faceR * 1.05;
      // bold eyes
      let eyeOffsetX = faceR * 0.32;
      let eyeOffsetY = -faceR * 0.22;
      let dEyeL = dist(gx, gy, -eyeOffsetX, eyeOffsetY);
      let dEyeR = dist(gx, gy,  eyeOffsetX, eyeOffsetY);
      let onEye = (dEyeL < eyeR) || (dEyeR < eyeR);
      // thick mouth arc
      let angle = atan2(gy, gx);
      let onMouth = (
        d > mouthR * 0.90 && d < mouthR * 1.12 &&
        gy > faceR * 0.05 &&
        angle > PI * 0.10 && angle < PI * 0.90
      );
      let isFeature = onFaceOutline || onEye || onMouth;
      let ch;
      if (isFeature) {
        ch = '1';               // force features to be visible
      } else {
        ch = (random() < pBg) ? '1' : '0';
      }
      // random pastel fill each character
      if (random() < 0.5) {
        fill('#FDE1F0');   // light pink
      } else {
        fill('#DED7FE');   // light purple
      }
      text(ch, i * cellW + cellW / 2, j * cellH + cellH / 2);
    }
  }
}
