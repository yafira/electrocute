// a tiny flatbed pen plotter, for vera molnár and the first computer
// artists, who drew with pens moved by machines.
//
// it plots a little "(des)ordres": a grid of concentric squares, each
// corner nudged by chance. clicking clears the sheet and plots a new
// one while the gantry and pen carriage follow the line, with a soft
// stepper whir. hovering, or tapping on a phone, shares a fact about
// early computer art.

import { useEffect, useRef, useState } from "react";
import styles from "../styles/Plotter.module.css";
import { noise, tone } from "../lib/tinySynth";

const FACTS = [
  "before she ever used a computer, vera molnár drew by following strict rules by hand. she called it her \"machine imaginaire.\"",
  "vera molnár got her hands on a real computer in 1968 and drew with a pen plotter, a lot like this one.",
  "molnár's \"(des)ordres\" (1974) is a grid of concentric squares with a little chance in every corner. this plotter draws in its spirit.",
  "vera molnár made art for over seventy years and was still working when she died in 2023, at 99.",
  "in 1965 georg nees showed computer-plotted drawings in stuttgart, one of the very first computer art exhibitions.",
  "frieder nake's \"hommage à paul klee\" (1965) was drawn by a zuse graphomat z64 plotter.",
  "\"cybernetic serendipity\" at london's ICA in 1968 brought computer art, music and robots to a big audience.",
  "lillian schwartz made some of the first computer art films at bell labs, like \"pixillation\" in 1970.",
  "in the 1970s harold cohen started AARON, a program that made its own drawings. he kept teaching it for over 40 years.",
];

// pastel pen colors, a little deeper than the tokens so they show on paper
const PENS = ["#9d8cf0", "#e08cc4", "#7fbf9a", "#8fb3e8"];

// the sheet, in svg units
const PAPER = { x: 22, y: 20, w: 96, h: 76 };
const GRID_X = 4;
const GRID_Y = 3;
const CELL = 20;
const PAD_X = (PAPER.w - GRID_X * CELL) / 2;
const PAD_Y = (PAPER.h - GRID_Y * CELL) / 2;

// a small seeded random, so the first drawing is the same on the server
// and in the browser
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// every square as a list of points. squares get wobblier toward the
// middle of the sheet, and some cells skip a ring, like molnár's
function plan(seed) {
  const rand = rng(seed);
  const strokes = [];
  for (let gy = 0; gy < GRID_Y; gy++) {
    for (let gx = 0; gx < GRID_X; gx++) {
      const cx = PAPER.x + PAD_X + gx * CELL + CELL / 2;
      const cy = PAPER.y + PAD_Y + gy * CELL + CELL / 2;
      const rings = 2 + Math.floor(rand() * 3);
      for (let r = 0; r < rings; r++) {
        const half = 8.5 - r * 2.4;
        const wob = 0.5 + rand() * 1.6;
        const j = () => (rand() - 0.5) * wob * 2;
        const pts = [
          [cx - half + j(), cy - half + j()],
          [cx + half + j(), cy - half + j()],
          [cx + half + j(), cy + half + j()],
          [cx - half + j(), cy + half + j()],
        ];
        strokes.push([...pts, pts[0]]);
      }
    }
  }
  return strokes;
}

// how many points there are in total, to step the pen through
const total = (strokes) => strokes.reduce((n, s) => n + s.length, 0);

const STEP_MS = 32;

export default function PlotterTrinket({ x, y, rot = 0, isMobile = false }) {
  const [seed, setSeed] = useState(1974);
  const [strokes, setStrokes] = useState(() => plan(1974));
  // how many points the pen has reached so far
  const [drawn, setDrawn] = useState(() => total(plan(1974)));
  const [pen, setPen] = useState(0);
  const [fact, setFact] = useState(null);
  const factIndex = useRef(Math.floor(Math.random() * FACTS.length));
  const timer = useRef(null);
  const hideTimer = useRef(null);

  useEffect(
    () => () => {
      clearInterval(timer.current);
      clearTimeout(hideTimer.current);
    },
    [],
  );

  const nextFact = () => {
    setFact(FACTS[factIndex.current % FACTS.length]);
    factIndex.current += 1;
  };

  const plot = () => {
    clearInterval(timer.current);
    const nextSeed = seed + 1 + Math.floor(Math.random() * 9999);
    const next = plan(nextSeed);
    const end = total(next);
    setSeed(nextSeed);
    setStrokes(next);
    setPen((p) => (p + 1) % PENS.length);
    setDrawn(0);

    // the sheet gets pulled out and a fresh one goes in
    noise(0, { dur: 0.22, peak: 0.025, band: 1400, q: 0.7 });

    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setDrawn(n);
      // the steppers tick as the pen moves
      if (n % 2 === 0) {
        tone(0, {
          freq: 140 + Math.random() * 60,
          dur: 0.03,
          peak: 0.006,
          type: "square",
          filter: 700,
        });
      }
      if (n >= end) {
        clearInterval(timer.current);
        // the pen lifts off with a little click
        tone(0.05, { freq: 1800, dur: 0.02, peak: 0.01, type: "triangle" });
      }
    }, STEP_MS);

    nextFact();
    // on a phone there's no hover to tuck the note away again
    if (isMobile) {
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setFact(null), 6000);
    }
  };

  // walk the strokes up to where the pen is, and find the pen tip
  let left = drawn;
  let tip = null;
  const paths = [];
  for (const s of strokes) {
    if (left <= 0) break;
    const shown = s.slice(0, Math.min(left, s.length));
    left -= s.length;
    if (shown.length > 1) {
      paths.push(
        "M " + shown.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(" L "),
      );
    }
    tip = shown[shown.length - 1];
  }
  const done = drawn >= total(strokes);
  // when the plot is finished the pen parks in the top corner
  const [penX, penY] = !tip || done ? [PAPER.x + PAPER.w + 6, PAPER.y - 6] : tip;
  const color = PENS[pen];

  return (
    <button
      type="button"
      className={`${styles.plotter} ${isMobile ? styles.inline : ""}`}
      style={isMobile ? undefined : { left: x, top: y, transform: `rotate(${rot}deg)` }}
      onClick={plot}
      onMouseEnter={isMobile ? undefined : nextFact}
      onMouseLeave={isMobile ? undefined : () => setFact(null)}
      onFocus={nextFact}
      onBlur={() => setFact(null)}
      aria-label="tiny pen plotter, after vera molnár: plot a new drawing"
      aria-describedby={fact ? "plotter-fact" : undefined}
    >
      <svg viewBox="0 0 140 128" className={styles.svg} aria-hidden="true">
        {/* the bed */}
        <rect x="2" y="6" width="136" height="104" rx="10" className={styles.bed} />
        <rect x="8" y="12" width="5" height="92" rx="2.5" className={styles.rail} />
        <rect x="127" y="12" width="5" height="92" rx="2.5" className={styles.rail} />

        {/* the sheet */}
        <rect
          x={PAPER.x}
          y={PAPER.y}
          width={PAPER.w}
          height={PAPER.h}
          rx="2"
          className={styles.paper}
        />
        {paths.map((d, i) => (
          <path key={`${seed}-${i}`} d={d} className={styles.ink} style={{ stroke: color }} />
        ))}

        {/* the gantry slides up and down, the carriage along it */}
        <g className={styles.gantry} style={{ transform: `translateY(${penY}px)` }}>
          <rect x="6" y="-3" width="128" height="6" rx="3" className={styles.bar} />
          <g className={styles.carriage} style={{ transform: `translateX(${penX}px)` }}>
            <rect x="-6" y="-7" width="12" height="11" rx="2.5" className={styles.head} />
            <rect x="-1.6" y="-15" width="3.2" height="10" rx="1.2" style={{ fill: color }} />
            <circle cx="0" cy="0" r="1.3" style={{ fill: color }} />
          </g>
        </g>

        <text x="10" y="123" className={styles.label}>
          plotter
        </text>
        <text x="130" y="123" textAnchor="end" className={styles.label}>
          for v.m.
        </text>
      </svg>

      {fact && (
        <span id="plotter-fact" role="tooltip" className={styles.fact}>
          {fact}
        </span>
      )}
    </button>
  );
}
