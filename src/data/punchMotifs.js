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
