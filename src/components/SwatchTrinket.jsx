// a little felt swatch from the soft circuit library: a coin cell and
// an led sequin sewn on and joined by two traces of conductive thread,
// with a woven tag stitched to the top.
//
// clicking it lights the sequin, and when the light flickers out the
// swatch gets mended: a new pink cross-stitch lands on the thread and
// the tag gets today's date, the way every repair in the library is
// dated. hovering, or tapping on a phone, shares a soft circuit care tip.

import { useEffect, useRef, useState } from "react";
import styles from "../styles/Swatch.module.css";
import { tone } from "../lib/tinySynth";

const TIPS = [
  "conductive thread frays at the knots. a dab of clear nail polish keeps them from coming undone.",
  "keep the + and − traces far apart. if two loose threads touch, the circuit shorts.",
  "sew around each pad three or four times so the thread holds tight to the component.",
  "keep running stitches snug. slack thread makes for flickering lights.",
  "take the coin cell out before a soft circuit goes anywhere near the wash.",
  "visible mending makes a repair part of the story instead of hiding it.",
  "every repair in the library gets a date, so each card keeps its own history.",
];

// where mends can land: spots along the two thread traces
const MEND_SPOTS = [
  [46, 36],
  [64, 36],
  [82, 38],
  [50, 62],
  [70, 62],
  [86, 58],
];

// felt cut with pinking shears: a zigzag all the way around
function pinkedEdge(x0, y0, x1, y1, tooth = 4) {
  const pts = [];
  const along = (ax, ay, bx, by, out) => {
    const len = Math.hypot(bx - ax, by - ay);
    const n = Math.round(len / tooth);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const px = ax + (bx - ax) * t;
      const py = ay + (by - ay) * t;
      const o = i % 2 ? 0 : 1.8;
      pts.push([px + out[0] * o, py + out[1] * o]);
    }
  };
  along(x0, y0, x1, y0, [0, -1]);
  along(x1, y0, x1, y1, [1, 0]);
  along(x1, y1, x0, y1, [0, 1]);
  along(x0, y1, x0, y0, [-1, 0]);
  return pts.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
}

const EDGE = pinkedEdge(4, 8, 116, 90);

const today = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}.${dd}`;
};

export default function SwatchTrinket({ x, y, rot = 0, isMobile = false }) {
  // the swatch arrives with one old mend already on it
  const [mends, setMends] = useState([1]);
  const [date, setDate] = useState("03.26");
  const [lit, setLit] = useState(false);
  const [tip, setTip] = useState(null);
  const tipIndex = useRef(Math.floor(Math.random() * TIPS.length));
  const timers = useRef([]);

  useEffect(() => {
    const pending = timers;
    return () => pending.current.forEach(clearTimeout);
  }, []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const nextTip = () => {
    setTip(TIPS[tipIndex.current % TIPS.length]);
    tipIndex.current += 1;
  };

  const mend = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    // the sequin lights with a little chime
    setLit(true);
    tone(0, { freq: 1046, dur: 0.18, peak: 0.018, type: "triangle" });
    tone(0.09, { freq: 1568, dur: 0.22, peak: 0.012, type: "triangle" });

    // then flickers out, and gets mended
    later(() => setLit(false), 700);
    later(() => setLit(true), 780);
    later(() => {
      setLit(false);
      setMends((cur) => {
        const free = MEND_SPOTS.map((_, i) => i).filter((i) => !cur.includes(i));
        // a fully mended swatch starts over, like a fresh one from the box
        if (!free.length) return [Math.floor(Math.random() * MEND_SPOTS.length)];
        return [...cur, free[Math.floor(Math.random() * free.length)]];
      });
      setDate(today());
      // a needle going through felt
      tone(0, { freq: 520, to: 260, dur: 0.06, peak: 0.01, type: "sine" });
      tone(0.12, { freq: 520, to: 260, dur: 0.06, peak: 0.01, type: "sine" });
    }, 900);

    nextTip();
    // on a phone there's no hover to tuck the note away again
    if (isMobile) later(() => setTip(null), 6000);
  };

  return (
    <button
      type="button"
      className={`${styles.card} ${isMobile ? styles.inline : ""}`}
      style={isMobile ? undefined : { left: x, top: y, transform: `rotate(${rot}deg)` }}
      onClick={mend}
      onMouseEnter={isMobile ? undefined : nextTip}
      onMouseLeave={isMobile ? undefined : () => setTip(null)}
      onFocus={nextTip}
      onBlur={() => setTip(null)}
      aria-label="a soft circuit swatch from the library: light it and mend it"
      aria-describedby={tip ? "swatch-tip" : undefined}
    >
      <svg viewBox="0 0 120 92" className={styles.svg} aria-hidden="true">
        {/* the felt, with a faint weave */}
        <polygon points={EDGE} className={styles.felt} />
        {[18, 26, 34, 42, 50, 58, 66, 74, 82].map((ly) => (
          <line key={`h${ly}`} x1="8" y1={ly} x2="112" y2={ly} className={styles.weave} />
        ))}
        {[14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94, 102, 110].map((lx) => (
          <line key={`v${lx}`} x1={lx} y1="12" x2={lx} y2="86" className={styles.weave} />
        ))}

        {/* the woven tag, stitched on at the top */}
        <rect x="30" y="2" width="60" height="13" rx="1.5" className={styles.tag} />
        <rect x="32" y="4" width="56" height="9" rx="1" className={styles.tagStitch} />
        <text x="60" y="11" textAnchor="middle" className={styles.label}>
          no.07 · {date}
        </text>

        {/* two traces of conductive thread, in running stitch */}
        <path d="M 30 40 C 50 30, 76 30, 96 42" className={styles.thread} />
        <path d="M 30 56 C 50 66, 76 66, 96 56" className={styles.thread} />

        {/* the coin cell holder */}
        <circle cx="26" cy="48" r="13" className={styles.cell} />
        <circle cx="26" cy="48" r="8.5" className={styles.cellTop} />
        <text x="26" y="51" textAnchor="middle" className={styles.cellMark}>
          +
        </text>

        {/* the led sequin */}
        {lit && <circle cx="100" cy="49" r="13" className={styles.glow} />}
        <circle cx="100" cy="49" r="7.5" className={lit ? styles.sequinLit : styles.sequin} />
        <circle cx="100" cy="49" r="2.4" className={styles.sequinHole} />

        {/* the mends, each a little pink cross-stitch over the thread */}
        {mends.map((i) => {
          const [mx, my] = MEND_SPOTS[i];
          return (
            <g key={i} className={styles.mend}>
              <line x1={mx - 3} y1={my - 3} x2={mx + 3} y2={my + 3} />
              <line x1={mx + 3} y1={my - 3} x2={mx - 3} y2={my + 3} />
            </g>
          );
        })}
      </svg>

      {tip && (
        <span id="swatch-tip" role="tooltip" className={styles.tip}>
          {tip}
        </span>
      )}
    </button>
  );
}
