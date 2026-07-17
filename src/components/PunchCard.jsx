// the communal punch card: a 24-stitch knitting machine card
// (in honor of the KH-930) that visitors punch together, one hole
// each. holes are punched in carriage order, bottom row first, and
// the fabric below knits itself live: every punched hole becomes a
// contrast stitch in the swatch. finished cards are counted.
// shared via /api/punch, per-device fallback without a backend.

import { useEffect, useMemo, useState } from "react";
import styles from "../styles/PunchCard.module.css";

const LOCAL_COUNT_KEY = "electrocute:punchcard:local-count";
const PUNCHED_KEY = "electrocute:punchcard:punched";

// the motif, 24 stitches wide: three little flowers on stems,
// a seed row beneath. '#' = punched hole = contrast stitch.
const MOTIF = [
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
];

const COLS = 24;
const ROWS = MOTIF.length;

// cells in carriage order: bottom row first, left to right —
// the way the card feeds through the machine as the fabric grows.
function buildCells() {
  const cells = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    for (let c = 0; c < COLS; c++) {
      cells.push({ row: r, col: c, hole: MOTIF[r][c] === "#" });
    }
  }
  return cells;
}

const CELLS = buildCells();
const HOLES = CELLS.filter((cell) => cell.hole);
const CARD_SIZE = HOLES.length;

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
        if (alive)
          setCount(Number(localStorage.getItem(LOCAL_COUNT_KEY)) || 0);
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
  const punched = total === 0 ? 0 : ((total - 1) % CARD_SIZE) + 1;
  const cardsDone = total === 0 ? 0 : Math.floor((total - 1) / CARD_SIZE);

  // where the carriage has knit to: the cell index of the most
  // recently punched hole. everything up to it is decided fabric.
  const carriage = useMemo(() => {
    if (punched === 0) return -1;
    const lastHole = HOLES[punched - 1];
    return CELLS.findIndex(
      (cell) => cell.row === lastHole.row && cell.col === lastHole.col
    );
  }, [punched]);

  const punchedSet = useMemo(() => {
    const set = new Set();
    HOLES.slice(0, punched).forEach((h) => set.add(`${h.row}-${h.col}`));
    return set;
  }, [punched]);

  const knitRow = carriage < 0 ? 0 : Math.floor(carriage / COLS) + 1;
  const newest = punched > 0 ? HOLES[punched - 1] : null;

  // ── card geometry ──
  const cell = 15;
  const edge = 22; // sprocket margins
  const headH = 26;
  const cardW = COLS * cell + edge * 2;
  const cardH = ROWS * cell + headH + 14;

  // ── fabric geometry ──
  const st = 14;
  const fabW = COLS * st + 16;
  const fabH = ROWS * st + 16;

  return (
    <section className={styles.punchcard}>
      <h2>the communal punch card</h2>
      <p className={styles.intro}>
        every visitor punches one hole, carriage order, bottom row
        first. below, the machine knits what we&apos;ve punched so far.
      </p>

      <div className={styles.machine}>
        {/* ── the card ── */}
        <svg
          className={styles.card}
          viewBox={`0 0 ${cardW} ${cardH}`}
          role="img"
          aria-label={`communal punch card, ${punched} of ${CARD_SIZE} holes punched`}
        >
          {/* manila card with a clipped corner */}
          <path
            d={`M 14 0 H ${cardW - 26} L ${cardW} 26 V ${cardH - 8} Q ${cardW} ${cardH} ${cardW - 8} ${cardH} H 8 Q 0 ${cardH} 0 ${cardH - 8} V 14 Q 0 0 14 0 Z`}
            fill="#f7f1df"
            stroke="#e6dcc0"
            strokeWidth="1.5"
          />
          <text
            x={edge}
            y={17}
            className={styles.cardLabel}
          >
            electrocute lab · 24 st · card no.{cardsDone + 1}
          </text>

          {/* sprocket holes down both edges */}
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

          {/* the pattern grid */}
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
              // plain positions: the faintest tick, like the card's grid
              return (
                <circle
                  key={key}
                  cx={cx}
                  cy={cy}
                  r="1"
                  fill="#e6dcc0"
                />
              );
            }
            return (
              <g key={key}>
                {/* the hole position: dotted ring until punched */}
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
                {/* the falling chad */}
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

        {/* ── the knit preview ── */}
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
            const isContrast = punchedSet.has(
              `${cellDef.row}-${cellDef.col}`
            );
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
              <g
                key={key}
                className={isNewest ? styles.newStitchV : undefined}
              >
                {/* a little knit V */}
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
            {shared ? " by visitors" : " on this device"} · row {knitRow} of{" "}
            {ROWS} on the machine
            {cardsDone > 0 && (
              <>
                {" "}
                · {cardsDone} {cardsDone === 1 ? "card" : "cards"} knit ✿
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
        {hasPunched ? "you've punched your hole ✿" : "punch your hole"}
      </button>
    </section>
  );
}
