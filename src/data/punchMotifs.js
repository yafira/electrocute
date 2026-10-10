// the punch card's motifs and the math that turns the all-time punch
// count into "which card, which hole". shared by the card on the home
// page, the punch api (to notice when a card is finished) and the
// archive page.

export const COLS = 24;

export const MOTIFS = [
  {
    name: "three flowers",
    rows: [
      "........................",
      "...##......##......##...",
      "..####....####....####..",
      "..####....####....####..",
      "...##......##......##...",
      ".....#......#......#....",
      ".....#......#......#....",
      "....##.....##.....##....",
      ".....#......#......#....",
      "........................",
      "#..#..#..#..#..#..#..#..",
      "........................",
    ],
  },
  {
    name: "one heart",
    rows: [
      ".........##..##.........",
      "........########........",
      "........########........",
      "........########........",
      ".........######.........",
      "..........####..........",
      "...........##...........",
      "........................",
      "#..#..#..#..#..#..#..#..",
    ],
  },
  {
    name: "one smiley",
    rows: [
      ".........#####..........",
      "........#.....#.........",
      ".......#..#.#..#........",
      ".......#.......#........",
      ".......#.#...#.#........",
      ".......#..###..#........",
      "........#.....#.........",
      ".........#####..........",
      "........................",
      "#..#..#..#..#..#..#..#..",
    ],
  },
  {
    name: "one star",
    rows: [
      "...........#............",
      "...........#............",
      ".........#####..........",
      ".........#####..........",
      ".......#########........",
      "........#######.........",
      ".........#####..........",
      "........##...##.........",
      ".......##.....##........",
      "........................",
      "#..#..#..#..#..#..#..#..",
    ],
  },
];

// carriage order for one motif: bottom row first, left to right —
// the way the card feeds through the machine as fabric grows.
export function buildMotifData(rows) {
  const numRows = rows.length;
  const cells = [];
  for (let r = numRows - 1; r >= 0; r--) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ row: r, col: c, hole: rows[r][c] === "#" });
    }
  }
  const holes = cells.filter((cell) => cell.hole);
  return { cells, holes, numRows, holeCount: holes.length };
}

export const MOTIF_DATA = MOTIFS.map((m) => buildMotifData(m.rows));
const CYCLE_HOLE_COUNTS = MOTIF_DATA.map((d) => d.holeCount);
const CYCLE_TOTAL = CYCLE_HOLE_COUNTS.reduce((a, b) => a + b, 0);

// given the all-time punch total, resolves which motif is currently
// being filled, how far into it, and how many motif-cards have been
// completed overall (cycling back to the first motif when the list
// runs out).
export function resolvePosition(total) {
  if (!total || total <= 0) {
    return { motifIndex: 0, punchedInMotif: 0, cardsDone: 0 };
  }
  const idx0 = total - 1;
  const cyclesCompleted = Math.floor(idx0 / CYCLE_TOTAL);
  const posInCycle = idx0 % CYCLE_TOTAL;

  let running = 0;
  let motifIndex = 0;
  let posInMotif = 0;
  for (let i = 0; i < MOTIF_DATA.length; i++) {
    if (posInCycle < running + CYCLE_HOLE_COUNTS[i]) {
      motifIndex = i;
      posInMotif = posInCycle - running;
      break;
    }
    running += CYCLE_HOLE_COUNTS[i];
  }

  return {
    motifIndex,
    punchedInMotif: posInMotif + 1,
    cardsDone: cyclesCompleted * MOTIF_DATA.length + motifIndex,
  };
}

// how many cards are completely punched for a given all-time total
export function completedCards(total) {
  const { motifIndex, punchedInMotif, cardsDone } = resolvePosition(total);
  const full = punchedInMotif === MOTIF_DATA[motifIndex].holeCount;
  return full ? cardsDone + 1 : cardsDone;
}

// card numbers start at 1 and cycle through the motifs in order
export function motifForCard(cardNo) {
  return MOTIFS[(cardNo - 1) % MOTIFS.length];
}

// yarns named after the electrocute-ui palette. the contrast yarn is
// the exact token, the main yarn is a deeper take on its pale token
// so the plain stitches still show up
export const YARNS = [
  { name: "blush-powder & lavender-beam", base: "#fbdce9", contrast: "#baaeff" },
  { name: "matcha-foam & peony-fizz", base: "#dcefc9", contrast: "#f2b9e0" },
  { name: "cloud-shoes & twilight-haze", base: "#dbe8ff", contrast: "#c0c1de" },
  { name: "apricot-glaze & lavender-beam", base: "#fde0c8", contrast: "#baaeff" },
  { name: "mint-sheen & peony-fizz", base: "#cfeedd", contrast: "#f2b9e0" },
  { name: "periwinkle-shimmer & peony-fizz", base: "#ddd9ff", contrast: "#f2b9e0" },
];

// every yarn pair meets every motif once before any combo repeats:
// 4 motifs × 6 yarns = 24 different cards. each round of 12 the yarns
// shift by one, so the pairings that already happened don't come back
export function yarnForCard(cardNo) {
  const n = cardNo - 1;
  const shift = Math.floor(n / (MOTIFS.length * YARNS.length / 2));
  return YARNS[(n + shift) % YARNS.length];
}

// a yarn color mixed toward white, for the felt the swatch sits on
export function wash(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `rgb(${r}, ${g}, ${b})`;
}
