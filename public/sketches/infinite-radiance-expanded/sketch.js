// twin phasing tunnels — lively, loopable, riso-friendly preview
// keys:
//   f = toggle fills
//   m = toggle misregistration jitter (preview the riso pop)
//   p = switch 2-color palette (like changing inks)
//   s = save out all frames once (PNG sequence)
//
// tweak these first:
const FPS = 12;         // try 10 / 12 / 15
const DURATION = 5;     // seconds per perfect loop (4-6 feels good)
const RINGS = 90;       // number of concentric squares per layer
const STEP_A = 0.90;    // scale step for layer A (0.86-0.93)
const STEP_B = 0.88;    // scale step for layer B (slightly different for phasing)
const ROT_A = 6;        // total deg rotation across loop (A clockwise)
const ROT_B = -7;       // total deg rotation across loop (B counterclockwise)
const WOBBLE_ROT = 0.9; // per-ring sinusoidal wobble (degrees)
const WOBBLE_TR  = 1.0; // per-ring translation wobble (pixels)
const STROKE_W   = 2;
let N;            // frames per loop
let fillOn = false;
let misregOn = false;
let paletteIdx = 0;
let saving = false;
let frameSaved = 0;
const palettes = [
  // palette 0: mint + pink (screen preview only; riso comes later)
  { a: [185, 255, 220], b: [255, 120, 190] },
  // palette 1: sunflower + federal blue
  { a: [255, 200, 40],  b: [28, 60, 160] },
  // palette 2: orchid + black (nice contrast)
  { a: [200, 120, 210], b: [10, 10, 10]  }
];
function setup() {
  createCanvas(800, 800);
  pixelDensity(2);
  frameRate(FPS);
  rectMode(CENTER);
  noSmooth();
  N = int(FPS * DURATION);
}
function draw() {
  const f = frameCount % N;
  const t = f / N;              // 0..1 (non-inclusive at 1)
  const phi = TAU * t;          // base phase
  background(0);
  translate(width/2, height/2);
  // organic breath (ping-pong via sine squared)
  const breath = easeInOutCubic(0.5 - 0.5 * cos(phi)); // 0..1..0
  const maxSide = min(width, height) * 0.86;
  const minSide = maxSide * 0.20;
  const sideNow = lerp(minSide, maxSide, breath);
  // tiny global rotation drift (helps the vibe)
  rotate(radians( (ROT_A * 0.2) * sin(phi) ));
  // draw two layers (like two inks)
  const pal = palettes[paletteIdx];
  drawLayer(sideNow, STEP_A, ROT_A, +1, color(pal.a[0], pal.a[1], pal.a[2]), phi, 0.0);
  drawLayer(sideNow, STEP_B, ROT_B, -1, color(pal.b[0], pal.b[1], pal.b[2]), phi, PI * 0.35);
  // save sequence if requested
  if (saving) {
    saveCanvas(nf(frameSaved, 4), 'png');
    frameSaved++;
    if (frameSaved >= N) saving = false;
  }
}
function drawLayer(sideStart, step, totalDeg, dir, col, phi, phaseOffset) {
  push();
  // layer rotation across loop
  rotate(radians(totalDeg) * ((sin(phi + phaseOffset) + 1) * 0.5) * dir);
  // optional misregistration: tiny offset that beats across loop
  if (misregOn) {
    const jx = 0.6 * sin(phi * 3.0 + phaseOffset);
    const jy = 0.6 * cos(phi * 2.0 + phaseOffset);
    translate(jx, jy);
  }
  stroke(col);
  strokeWeight(STROKE_W);
  let s = sideStart;
  for (let i = 0; i < RINGS; i++) {
    // per-ring wobble (loop-safe: uses phi + i*const)
    const wob = radians(WOBBLE_ROT) * sin(phi * 2.0 + i * 0.19 + phaseOffset);
    const tx  = WOBBLE_TR * sin(phi * 1.7 + i * 0.23 + phaseOffset);
    const ty  = WOBBLE_TR * cos(phi * 1.3 + i * 0.17 + phaseOffset);
    push();
    translate(tx, ty);
    rotate(wob);
    if (fillOn && (i % 2 === 0)) { // alternating fills to keep coverage lower
      const a = map(i, 0, RINGS-1, 180, 40); // fade inner rings
      fill(red(col), green(col), blue(col), a);
    } else {
      noFill();
    }
    rect(0, 0, s, s);
    pop();
    s *= step;
    if (s < 0.6) break;
  }
  pop();
}
// cubic ease in/out
function easeInOutCubic(u) {
  return u < 0.5 ? 4 * u * u * u : 1 - pow(-2 * u + 2, 3) / 2;
}
function keyPressed() {
  if (key === 'f' || key === 'F') fillOn = !fillOn;
  if (key === 'm' || key === 'M') misregOn = !misregOn;
  if (key === 'p' || key === 'P') paletteIdx = (paletteIdx + 1) % palettes.length;
  if (key === 's' || key === 'S') {
    // start saving N frames from next frame
    if (!saving) { saving = true; frameSaved = 0; }
  }
}
