// the communal punch card. every visitor punches one hole; holes fill
// the card in carriage order and the fabric below knits itself as
// they land. shared via /api/punch, falls back to per-device
// localStorage if there's no backend.
//
// cards cycle through several motifs instead of repeating the same
// one forever. motifs don't need matching hole counts — the whole
// punch history is treated as one continuous sequence across however
// many patterns are listed, so adding, removing, or reordering motifs
// never renumbers or erases anyone's already-punched progress.

import { useEffect, useMemo, useState } from "react";
import styles from "../styles/PunchCard.module.css";

const LOCAL_COUNT_KEY = "electrocute:punchcard:local-count";
const PUNCHED_KEY = "electrocute:punchcard:punched";

const COLS = 24;

const MOTIFS = [
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
function buildMotifData(rows) {
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

const MOTIF_DATA = MOTIFS.map((m) => buildMotifData(m.rows));
const CYCLE_HOLE_COUNTS = MOTIF_DATA.map((d) => d.holeCount);
const CYCLE_TOTAL = CYCLE_HOLE_COUNTS.reduce((a, b) => a + b, 0);

// given the all-time punch total, resolves which motif is currently
// being filled, how far into it, and how many motif-cards have been
// completed overall (cycling back to the first motif when the list
// runs out).
function resolvePosition(total) {
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

export default function PunchCard() {
  const [count, setCount] = useState(null);
  const [shared, setShared] = useState(false);
  const [hasPunched, setHasPunched] = useState(false);
  const [justPunched, setJustPunched] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setHasPunched(Boolean(localStorage.getItem(PUNCHED_KEY)));
    let alive = true;
    fetch("/api/punch")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data.shared && typeof data.count === "number") {
          setShared(true);
          setCount(data.count);
        } else {
          setCount(Number(localStorage.getItem(LOCAL_COUNT_KEY)) || 0);
        }
      })
      .catch(() => {
        if (alive) setCount(Number(localStorage.getItem(LOCAL_COUNT_KEY)) || 0);
      });
    return () => {
      alive = false;
    };
  }, []);

  const punch = async () => {
    if (hasPunched || busy) return;
    setBusy(true);
    setJustPunched(true);
    if (shared) {
      try {
        const res = await fetch("/api/punch", { method: "POST" });
        const data = await res.json();
        if (typeof data.count === "number") setCount(data.count);
      } catch {
        setCount((c) => (c || 0) + 1);
      }
    } else {
      setCount((c) => {
        const next = (c || 0) + 1;
        localStorage.setItem(LOCAL_COUNT_KEY, String(next));
        return next;
      });
    }
    localStorage.setItem(PUNCHED_KEY, "1");
    setHasPunched(true);
    setBusy(false);
    setTimeout(() => setJustPunched(false), 1500);
  };

  const total = count || 0;
  const { motifIndex, punchedInMotif, cardsDone } = resolvePosition(total);
  const motif = MOTIFS[motifIndex];
  const data = MOTIF_DATA[motifIndex];
  const {
    cells: CELLS,
    holes: HOLES,
    numRows: ROWS,
    holeCount: CARD_SIZE,
  } = data;
  const punched = punchedInMotif;

  const carriage = useMemo(() => {
    if (punched === 0) return -1;
    const lastHole = HOLES[punched - 1];
    return CELLS.findIndex(
      (cell) => cell.row === lastHole.row && cell.col === lastHole.col,
    );
  }, [punched, CELLS, HOLES]);

  const punchedSet = useMemo(() => {
    const set = new Set();
    HOLES.slice(0, punched).forEach((h) => set.add(`${h.row}-${h.col}`));
    return set;
  }, [punched, HOLES]);

  const knitRow = carriage < 0 ? 0 : Math.floor(carriage / COLS) + 1;
  const newest = punched > 0 ? HOLES[punched - 1] : null;

  const cell = 15;
  const edge = 22;
  const headH = 26;
  const cardW = COLS * cell + edge * 2;
  const cardH = ROWS * cell + headH + 14;

  const st = 14;
  const fabW = COLS * st + 16;
  const fabH = ROWS * st + 16;

  return (
    <section className={styles.punchcard}>
      <h2>the communal punch card</h2>
      <p className={styles.intro}>
        every visitor punches one hole, carriage order, bottom row first. below,
        the machine knits what we&apos;ve punched so far — the pattern changes
        with every new card.
      </p>

      <div className={styles.machine}>
        <svg
          className={styles.card}
          viewBox={`0 0 ${cardW} ${cardH}`}
          role="img"
          aria-label={`${motif.name} punch card, ${punched} of ${CARD_SIZE} holes punched`}
        >
          <path
            d={`M 14 0 H ${cardW - 26} L ${cardW} 26 V ${cardH - 8} Q ${cardW} ${cardH} ${cardW - 8} ${cardH} H 8 Q 0 ${cardH} 0 ${cardH - 8} V 14 Q 0 0 14 0 Z`}
            fill="#f7f1df"
            stroke="#e6dcc0"
            strokeWidth="1.5"
          />
          <text x={edge} y={17} className={styles.cardLabel}>
            electrocute lab · 24 st · {motif.name} · card no.{cardsDone + 1}
          </text>

          {Array.from({ length: ROWS }, (_, r) => (
            <g key={`sp${r}`}>
              <circle
                cx={edge / 2}
                cy={headH + r * cell + cell / 2}
                r="3"
                fill="#4a4453"
              />
              <circle
                cx={cardW - edge / 2}
                cy={headH + r * cell + cell / 2}
                r="3"
                fill="#4a4453"
              />
            </g>
          ))}

          {CELLS.map((cellDef) => {
            const cx = edge + cellDef.col * cell + cell / 2;
            const cy = headH + cellDef.row * cell + cell / 2;
            const key = `${cellDef.row}-${cellDef.col}`;
            const isPunched = punchedSet.has(key);
            const isNewest =
              justPunched &&
              newest &&
              newest.row === cellDef.row &&
              newest.col === cellDef.col;
            if (!cellDef.hole) {
              return <circle key={key} cx={cx} cy={cy} r="1" fill="#e6dcc0" />;
            }
            return (
              <g key={key}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill={isPunched ? "#4a4453" : "none"}
                  stroke={isPunched ? "#332e3d" : "#cfc3a2"}
                  strokeWidth="1.2"
                  strokeDasharray={isPunched ? "none" : "2 2"}
                  className={isNewest ? styles.newHole : undefined}
                />
                {isNewest && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#f7f1df"
                    stroke="#e6dcc0"
                    strokeWidth="1"
                    className={styles.chad}
                  />
                )}
              </g>
            );
          })}
        </svg>

        <svg
          className={styles.fabric}
          viewBox={`0 0 ${fabW} ${fabH}`}
          role="img"
          aria-label={`knit preview, ${knitRow} of ${ROWS} rows on the machine`}
        >
          <rect
            x="0"
            y="0"
            width={fabW}
            height={fabH}
            rx="8"
            fill="#fff8fb"
            stroke="#fecfe2"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          {CELLS.map((cellDef, i) => {
            if (i > carriage) return null;
            const key = `st-${cellDef.row}-${cellDef.col}`;
            const isContrast = punchedSet.has(`${cellDef.row}-${cellDef.col}`);
            const x = 8 + cellDef.col * st + st / 2;
            const y = 8 + cellDef.row * st + st / 2;
            const arm = st * 0.32;
            const color = isContrast ? "#b2a4d4" : "#fbdce9";
            const isNewest =
              justPunched &&
              newest &&
              newest.row === cellDef.row &&
              newest.col === cellDef.col;
            return (
              <g key={key} className={isNewest ? styles.newStitchV : undefined}>
                <line
                  x1={x - arm}
                  y1={y - arm}
                  x2={x}
                  y2={y + arm}
                  stroke={color}
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
                <line
                  x1={x + arm}
                  y1={y - arm}
                  x2={x}
                  y2={y + arm}
                  stroke={color}
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>
      </div>

      <p className={styles.status}>
        {count === null ? (
          <>reading the card…</>
        ) : (
          <>
            {punched} of {CARD_SIZE} holes punched
            {" by visitors"} · row {knitRow} of {ROWS} on the machine
            {cardsDone > 0 && (
              <>
                {" "}
                · {cardsDone} {cardsDone === 1 ? "card" : "cards"} knit
              </>
            )}
          </>
        )}
      </p>

      <button
        type="button"
        className={styles.punchButton}
        onClick={punch}
        disabled={hasPunched || count === null || busy}
      >
        {hasPunched ? "you've punched your hole" : "punch your hole"}
      </button>
    </section>
  );
}
