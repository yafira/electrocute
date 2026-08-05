// meditative twin tunnels — breath-paced loop (riso-friendly preview)
// keys:
//   space = toggle subtle breath cue
//   p = switch palette
//   s = save out this full loop as PNGs

const FPS = 12;
const BREATH_PRESET = "box"; // "box" (4-4-4-4), "478" (4-7-8), or "custom"

// custom only: seconds for inhale, hold top, exhale, hold bottom
const CUSTOM = { in: 4, hold1: 2, out: 6, hold2: 2 };

const RINGS = 90;
const STEP_A = 0.9;
const STEP_B = 0.88;
const ROT_A = 6;
const ROT_B = -7;
const HOLD_ROT_SCALE = 0.1;
const WOBBLE_ROT = 0.6;
const WOBBLE_TR = 0.6;
const STROKE_W = 1.5;

let N;
let Ttotal;
let showCue = true;
let paletteIdx = 0;
let saving = false;
let frameSaved = 0;

// riso palettes (screen previews)
// palette 0: mint green + light blue (active)
// palette 1: orchid + black
// palette 2: federal blue (commented out)

const palettes = [
  // mint green + lighter, cooler sky blue
  { a: [100, 220, 140], b: [100, 180, 255] },
  { a: [200, 120, 210], b: [10, 10, 10] }, // orchid + black
  // { a: [100, 200, 120], b: [40, 80, 200] } // federal blue
];

let seg = {};

function setup() {
  createCanvas(800, 800);
  pixelDensity(2);
  noSmooth();
  rectMode(CENTER);
  setBreath(BREATH_PRESET);
  frameRate(FPS);
}

function setBreath(mode) {
  if (mode === "box") seg = { in: 4, hold1: 4, out: 4, hold2: 4 };
  else if (mode === "478") seg = { in: 4, hold1: 7, out: 8, hold2: 0 };
  else seg = CUSTOM;

  Ttotal = seg.in + seg.hold1 + seg.out + seg.hold2;
  N = int(FPS * Ttotal);
}

function draw() {
  const f = frameCount % N;
  const t = f / FPS;
  const phase = breathPhase(t);
  const state = breathState(t);

  background(0);
  translate(width / 2, height / 2);

  const maxSide = min(width, height) * 0.86;
  const minSide = maxSide * 0.22;
  const sideNow = lerp(minSide, maxSide, phase);

  const holdFactor = state.includes("hold") ? HOLD_ROT_SCALE : 1.0;
  const tNorm = t / Ttotal;
  rotate(radians(ROT_A * 0.2 * sin(TAU * tNorm)) * holdFactor);

  const alphaStroke = map(phase, 0, 1, 80, 160);
  const alphaFillHi = map(phase, 0, 1, 40, 120);

  const micro = state.includes("hold") ? 0.25 : 0;

  const pal = palettes[paletteIdx];
  drawLayer(
    sideNow,
    STEP_A,
    ROT_A * holdFactor,
    +1,
    color(pal.a[0], pal.a[1], pal.a[2], alphaStroke),
    t,
    0.0,
    alphaFillHi,
    micro
  );
  drawLayer(
    sideNow,
    STEP_B,
    ROT_B * holdFactor,
    -1,
    color(pal.b[0], pal.b[1], pal.b[2], alphaStroke),
    t,
    PI * 0.35,
    alphaFillHi,
    micro
  );

  if (showCue) drawBreathCue(phase, state);

  if (saving) {
    saveCanvas(nf(frameSaved, 4), "png");
    frameSaved++;
    if (frameSaved >= N) saving = false;
  }
}

function drawLayer(
  sideStart,
  step,
  totalDeg,
  dir,
  col,
  tSec,
  phaseOffset,
  aFill,
  microWobble
) {
  push();
  rotate(
    radians(totalDeg) *
      ((sin(TAU * (tSec / Ttotal) + phaseOffset) + 1) * 0.5) *
      dir
  );

  stroke(col);
  strokeWeight(STROKE_W);

  let s = sideStart;
  for (let i = 0; i < RINGS; i++) {
    const phi = TAU * (tSec / Ttotal);
    const wob =
      radians(WOBBLE_ROT + microWobble) *
      sin(phi * 2.0 + i * 0.19 + phaseOffset);
    const tx =
      (WOBBLE_TR + microWobble) * sin(phi * 1.7 + i * 0.23 + phaseOffset);
    const ty =
      (WOBBLE_TR + microWobble) * cos(phi * 1.3 + i * 0.17 + phaseOffset);

    push();
    translate(tx, ty);
    rotate(wob);

    // always filled now
    if (i % 2 === 0) {
      const a = map(i, 0, RINGS - 1, aFill, 25);
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

// breath timing helpers
function breathPhase(t) {
  let k = t % Ttotal;
  const a = seg.in,
    b = seg.hold1,
    c = seg.out,
    d = seg.hold2;

  if (k < a) return easeOutCubic(k / a);
  k -= a;
  if (k < b) return 1;
  k -= b;
  if (k < c) return 1 - easeInCubic(k / c);
  return 0;
}

function breathState(t) {
  let k = t % Ttotal;
  const a = seg.in,
    b = seg.hold1,
    c = seg.out,
    d = seg.hold2;
  if (k < a) return "in";
  k -= a;
  if (k < b) return "hold1";
  k -= b;
  if (k < c) return "out";
  return "hold2";
}

function easeInCubic(u) {
  return u * u * u;
}
function easeOutCubic(u) {
  return 1 - pow(1 - u, 3);
}

function drawBreathCue(phase, state) {
  push();
  noFill();
  stroke(255, 255, 255, 40);
  strokeWeight(1.5);
  const r = min(width, height) * 0.38;
  ellipse(0, 0, r * 2, r * 2);

  const ang = lerp(-HALF_PI, 3 * HALF_PI, phase);
  const dotX = r * cos(ang),
    dotY = r * sin(ang);

  let a = 120;
  if (state.includes("hold"))
    a = 60 + 60 * (0.5 + 0.5 * sin(frameCount * 0.08));
  fill(255, a);
  noStroke();
  circle(dotX, dotY, 8);

  textAlign(CENTER, CENTER);
  textSize(14);
  fill(255, 150);
  let label = state === "in" ? "inhale" : state === "out" ? "exhale" : "hold";
  text(label, 0, r + 22);
  pop();
}

function keyPressed() {
  if (key === " ") showCue = !showCue;
  if (key === "p" || key === "P")
    paletteIdx = (paletteIdx + 1) % palettes.length;
  if (key === "s" || key === "S") {
    if (!saving) {
      saving = true;
      frameSaved = 0;
    }
  }
}
