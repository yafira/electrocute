// computer.garden()
// p5.js port of the processing sketch made for processing community
// day 2026 @ nyc (original: openprocessing.org/sketch/3004986).
//
// four woven core-memory blocks (with a few flower-shaped cores
// mixed in) arranged like a real memory plane: tight grids within
// each block, generous framing around the whole assembly, and
// decorative edge-pin leads + corner mounting holes, like an
// actual chip package. each block writes itself in over time,
// threaded by X drive lines (rows), Y drive lines (columns), and
// a diagonal sense line per block.
//
// click anywhere to wipe the garden and write a new pattern.

// set FIXED_SEED >= 0 to reproduce a specific composition
const FIXED_SEED = -1;
let SEED;

// a broad spread of pastels, freely assigned — each core just
// picks one at random when it writes.
const paletteHex = [
  "#E9C2CE", // blush pink
  "#A9D9C4", // mint
  "#C7BEE0", // lilac
  "#F2C9B4", // soft peach
  "#B8D8DC", // powder blue
  "#E3B7B0", // dusty coral
];
const xWireColor = "#D9BFC0"; // X drive lines (rows)
const yWireColor = "#B9C8D6"; // Y drive lines (columns)
const senseWireColor = "#D9C6A0"; // diagonal sense line
const pinColor = "#B8B3AC"; // edge-pin leads and mounting holes
const bgHex = "#22252B"; // cool slate

// rgb triples for writing straight into the pixel buffer
let paletteRGB;
let bgRGB;

const SCALE = 4;
let bufW, bufH;
let buf;

const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// each block's density and flower/ring mix is randomized fresh on
// every generation, so successive gardens genuinely differ
let quadCols = 5;
let quadRows = 6;
const outerMarginXFrac = 0.16;
const outerMarginYFrac = 0.11;
const gapXFrac = 0.07;
const gapYFrac = 0.045;

let quadrants = [];
let cores = [];
let writeOrder = [];
let writeIndex = 0;
const writePerTick = 1;
const writeEvery = 30;
let writeTimer = 0;
let flowerChance = 0.35;

const refreshEvery = 5;

// seeded RNG (mulberry32) so the write pattern is reproducible
let rngState = 0;
function seedRnd(s) {
  rngState = s | 0;
}
function rnd() {
  rngState = (rngState + 0x6d2b79f5) | 0;
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function hexToRGB(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function setup() {
  createCanvas(1000, 1300);
  noSmooth();

  paletteRGB = paletteHex.map(hexToRGB);
  bgRGB = hexToRGB(bgHex);

  bufW = width / SCALE;
  bufH = height / SCALE;
  buf = createGraphics(bufW, bufH);
  buf.pixelDensity(1);
  buf.noSmooth();

  SEED = FIXED_SEED >= 0 ? FIXED_SEED : floor(random(999999));
  seedRnd(SEED);
  console.log("seed:", SEED);
  buildGrid();
  renderDitheredField();
}

function draw() {
  for (const c of cores) {
    if (c.written) {
      if (abs(c.size - c.baseSize) > 0.2) c.size = lerp(c.size, c.baseSize, 0.1);
      c.glow *= 0.9;
      if (c.glow < 0.01) c.glow = 0;
      if (c.shape === "flower") c.rotation += c.spinSpeed;
    }
  }

  writeTimer++;
  if (writeTimer > writeEvery && writeIndex < writeOrder.length) {
    for (let k = 0; k < writePerTick && writeIndex < writeOrder.length; k++) {
      const core = writeOrder[writeIndex];
      core.written = true;
      core.rgb = paletteRGB[floor(rnd() * paletteRGB.length)];
      core.glow = 1;
      writeIndex++;
    }
    writeTimer = 0;
  }

  if (frameCount % refreshEvery === 0) renderDitheredField();

  image(buf, 0, 0, width, height);
  drawWires();
  drawPackage();
}

// per-block X/Y threading, diagonal cross-stitches between every
// neighboring core, and a small via dot at every core.
function drawWires() {
  push();
  noFill();
  strokeCap(SQUARE);

  for (const q of quadrants) {
    const qw = q.cellW * (quadCols - 1);
    const qh = q.cellH * (quadRows - 1);

    stroke(xWireColor);
    strokeWeight(0.8);
    for (let gy = 0; gy < quadRows; gy++) {
      const y = (q.y0 + gy * q.cellH) * SCALE;
      line(q.x0 * SCALE, y, (q.x0 + qw) * SCALE, y);
    }

    stroke(yWireColor);
    strokeWeight(0.8);
    for (let gx = 0; gx < quadCols; gx++) {
      const x = (q.x0 + gx * q.cellW) * SCALE;
      line(x, q.y0 * SCALE, x, (q.y0 + qh) * SCALE);
    }

    // diagonal cross-stitches between every neighboring core, the
    // way sense wire actually threads a woven core plane
    stroke(senseWireColor);
    strokeWeight(0.6);
    for (let gy = 0; gy < quadRows - 1; gy++) {
      for (let gx = 0; gx < quadCols - 1; gx++) {
        const a = q.grid[gy][gx];
        const b = q.grid[gy][gx + 1];
        const c = q.grid[gy + 1][gx];
        const d = q.grid[gy + 1][gx + 1];
        line(a.x * SCALE, a.y * SCALE, d.x * SCALE, d.y * SCALE);
        line(b.x * SCALE, b.y * SCALE, c.x * SCALE, c.y * SCALE);
      }
    }
  }

  noStroke();
  fill(xWireColor);
  for (const c of cores) ellipse(c.x * SCALE, c.y * SCALE, 2, 2);

  pop();
}

// decorative package framing: edge-pin leads along all four sides
// and small mounting holes near the corners, like a real chip.
function drawPackage() {
  push();
  noFill();
  stroke(pinColor);
  strokeWeight(1);
  strokeCap(SQUARE);

  const pinLen = 6 * SCALE;
  const edgeMarginX = bufW * outerMarginXFrac * 0.55;
  const edgeMarginY = bufH * outerMarginYFrac * 0.55;

  const pinCountX = 22;
  for (let i = 0; i < pinCountX; i++) {
    const x = map(i, 0, pinCountX - 1, bufW * 0.08, bufW * 0.92) * SCALE;
    line(x, edgeMarginY * 0.4, x, edgeMarginY * 0.4 + pinLen);
    line(x, height - edgeMarginY * 0.4, x, height - edgeMarginY * 0.4 - pinLen);
  }

  const pinCountY = 16;
  for (let i = 0; i < pinCountY; i++) {
    const y = map(i, 0, pinCountY - 1, bufH * 0.1, bufH * 0.9) * SCALE;
    line(edgeMarginX * 0.4, y, edgeMarginX * 0.4 + pinLen, y);
    line(width - edgeMarginX * 0.4, y, width - edgeMarginX * 0.4 - pinLen, y);
  }

  noStroke();
  fill(pinColor);
  const holeR = 4.5 * SCALE * 0.5;
  const hx = bufW * 0.075;
  const hy = bufH * 0.065;
  ellipse(hx * SCALE, hy * SCALE, holeR * 2, holeR * 2);
  ellipse((bufW - hx) * SCALE, hy * SCALE, holeR * 2, holeR * 2);
  ellipse(hx * SCALE, (bufH - hy) * SCALE, holeR * 2, holeR * 2);
  ellipse((bufW - hx) * SCALE, (bufH - hy) * SCALE, holeR * 2, holeR * 2);

  pop();
}

// click or tap wipes the grid and rewrites it in a new order
function mousePressed() {
  SEED = floor(random(999999));
  seedRnd(SEED);
  console.log("seed:", SEED);
  buildGrid();
}

function buildGrid() {
  cores = [];
  quadrants = [];

  // vary the block density and flower/ring mix each generation
  quadCols = 4 + floor(rnd() * 3); // 4..6
  quadRows = 5 + floor(rnd() * 3); // 5..7
  flowerChance = 0.15 + rnd() * 0.35; // 0.15..0.5

  const outerMarginX = bufW * outerMarginXFrac;
  const outerMarginY = bufH * outerMarginYFrac;
  const gapX = bufW * gapXFrac;
  const gapY = bufH * gapYFrac;

  const quadW = (bufW - outerMarginX * 2 - gapX) / 2;
  const quadH = (bufH - outerMarginY * 2 - gapY) / 2;
  const cellW = quadW / (quadCols - 1);
  const cellH = quadH / (quadRows - 1);
  const baseSize = min(cellW, cellH) * 0.34;

  const origins = [
    [outerMarginX, outerMarginY],
    [outerMarginX + quadW + gapX, outerMarginY],
    [outerMarginX, outerMarginY + quadH + gapY],
    [outerMarginX + quadW + gapX, outerMarginY + quadH + gapY],
  ];

  for (const [x0, y0] of origins) {
    const q = new Quadrant(x0, y0, cellW, cellH, quadRows, quadCols);
    quadrants.push(q);
    for (let gy = 0; gy < quadRows; gy++) {
      for (let gx = 0; gx < quadCols; gx++) {
        const x = x0 + gx * cellW;
        const y = y0 + gy * cellH;
        const shape = rnd() < flowerChance ? "flower" : "ring";
        const core = new Core(x, y, baseSize, shape);
        cores.push(core);
        q.grid[gy][gx] = core;
      }
    }
  }

  // shuffle the write order (Fisher–Yates with the seeded RNG)
  writeOrder = cores.slice();
  for (let i = writeOrder.length - 1; i > 0; i--) {
    const j = floor(rnd() * (i + 1));
    const tmp = writeOrder[i];
    writeOrder[i] = writeOrder[j];
    writeOrder[j] = tmp;
  }
  writeIndex = 0;
  writeTimer = 0;
}

// per-pixel rendering only checks the local 3x3 core neighborhood
// within whichever quadrant a pixel falls near — far cheaper than
// testing every core in the whole garden against every pixel.
function renderDitheredField() {
  buf.loadPixels();
  const pw = buf.width;
  const ph = buf.height;
  const px = buf.pixels;

  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < pw; x++) {
      let bestDensity = 0;
      let bestColor = bgRGB;

      for (const q of quadrants) {
        const qw = q.cellW * (quadCols - 1);
        const qh = q.cellH * (quadRows - 1);
        const margin = min(q.cellW, q.cellH) * 0.7;
        if (x < q.x0 - margin || x > q.x0 + qw + margin) continue;
        if (y < q.y0 - margin || y > q.y0 + qh + margin) continue;

        const localGX = Math.round((x - q.x0) / q.cellW);
        const localGY = Math.round((y - q.y0) / q.cellH);

        for (let dgy = -1; dgy <= 1; dgy++) {
          const gy = localGY + dgy;
          if (gy < 0 || gy >= quadRows) continue;
          for (let dgx = -1; dgx <= 1; dgx++) {
            const gx = localGX + dgx;
            if (gx < 0 || gx >= quadCols) continue;
            const c = q.grid[gy][gx];
            if (!c.written) continue;
            const val = c.densityAt(x, y);
            if (val > bestDensity) {
              bestDensity = val;
              bestColor = c.rgb;
            }
          }
        }
      }

      const threshold = bayer[y % 4][x % 4] / 16;
      const col = bestDensity > threshold ? bestColor : bgRGB;
      const idx = (x + y * pw) * 4;
      px[idx] = col[0];
      px[idx + 1] = col[1];
      px[idx + 2] = col[2];
      px[idx + 3] = 255;
    }
  }
  buf.updatePixels();
}

class Quadrant {
  constructor(x0, y0, cellW, cellH, rows, cols) {
    this.x0 = x0;
    this.y0 = y0;
    this.cellW = cellW;
    this.cellH = cellH;
    this.grid = Array.from({ length: rows }, () => new Array(cols));
  }
}

class Core {
  constructor(x, y, baseSize, shape) {
    this.x = x;
    this.y = y;
    this.baseSize = baseSize;
    this.shape = shape; // "ring" or "flower"
    this.rgb = bgRGB;
    this.size = 0;
    this.written = false;
    this.glow = 0;
    this.rotation = rnd() * TWO_PI;
    this.spinSpeed = (rnd() - 0.5) * 0.01;
    this.petalCount = 5 + floor(rnd() * 3);
  }

  // an annulus (ring): 0 outside, 1 in the ring body, with a soft
  // dithered edge at both the inner hole and outer boundary.
  ringDensityAt(px, py) {
    const effSize = this.size * (1 + 0.3 * this.glow);
    const outerR = effSize;
    const innerR = effSize * 0.42;
    const dx = px - this.x;
    const dy = py - this.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r > outerR || r < innerR) return 0;
    const edgeBand = effSize * 0.14;
    if (r > outerR - edgeBand) return 1 - (r - (outerR - edgeBand)) / edgeBand;
    if (r < innerR + edgeBand) return (r - innerR) / edgeBand;
    return 1;
  }

  // the original petal-lobe shape, same size scale as a ring core.
  flowerDensityAt(px, py) {
    const effSize = this.size * (1 + 0.4 * this.glow);
    const dx = px - this.x;
    const dy = py - this.y;
    const r = Math.sqrt(dx * dx + dy * dy);
    if (r > effSize * 1.05) return 0;
    if (r < effSize * 0.18) return 1;
    const angle = Math.atan2(dy, dx) - this.rotation;
    const lobe = Math.pow(Math.abs(Math.cos((this.petalCount / 2) * angle)), 0.6);
    const maxR = effSize * (0.3 + 0.7 * lobe);
    if (r > maxR) return 0;
    return 1 - (r / maxR) * 0.55;
  }

  // briefly swells when freshly written, via glow; dispatches to
  // the ring or flower shape depending on this core's assignment.
  densityAt(px, py) {
    if (!this.written || this.size < 0.5) return 0;
    return this.shape === "flower"
      ? this.flowerDensityAt(px, py)
      : this.ringDensityAt(px, py);
  }
}
