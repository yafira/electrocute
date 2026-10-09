// a little core memory plane, in honor of margaret hamilton and the
// women who wove apollo's software by hand.
//
// a 4 × 4 grid of ferrite rings with one copper wire weaving past all of
// them, row by row like a knitting carriage. where the wire threads
// through a ring, that's a 1. where it dips under and around, a 0, just
// like core rope, and a ring holding a 1 is tinted pastel. clicking flips
// one bit (the wire re-threads itself) and a read pulse runs down the
// wire, lighting each ring in turn.
// hovering, or tapping on a phone, shares a fact about hamilton, apollo,
// and the rope weavers.

import { useEffect, useRef, useState } from "react";
import styles from "../styles/CoreRope.module.css";
import { noise, tone } from "../lib/tinySynth";

const FACTS = [
  "apollo's flight software lived in core rope memory: copper wire threaded through tiny magnetic rings. through a ring was a 1, around it was a 0.",
  "the ropes were woven by hand at raytheon, mostly by women, many with textile and watchmaking experience. once woven, the code couldn't be changed.",
  "margaret hamilton led the software engineering division at MIT's instrumentation lab, which wrote apollo's on-board flight software.",
  "hamilton coined the term \"software engineering\" so the work would be taken as seriously as building the hardware.",
  "during the apollo 11 landing, 1202 and 1201 alarms went off. the software dropped its low-priority jobs and kept the landing going.",
  "a famous 1969 photo shows margaret hamilton standing beside a stack of printed apollo code as tall as she is.",
  "hamilton's daughter lauren once crashed a simulator by starting a prelaunch program mid-flight. on apollo 8, astronaut jim lovell did the same thing.",
  "in 2016 margaret hamilton received the presidential medal of freedom for her work on apollo.",
];

const SIZE = 4;
const GAP = 40;
const ringPos = (i) => ({
  cx: 30 + (i % SIZE) * GAP,
  cy: 30 + Math.floor(i / SIZE) * GAP,
});
// the order the wire visits the rings: left to right, then back again
const THREAD = Array.from({ length: SIZE * SIZE }, (_, k) => {
  const row = Math.floor(k / SIZE);
  const col = k % SIZE;
  return row * SIZE + (row % 2 ? SIZE - 1 - col : col);
});
// how far the wire drops to pass under a ring it doesn't thread
const DIP = 17;
const HALF = 9; // half the width of the straight run at each ring

// builds the copper wire for the current bits: straight through a ring
// for a 1, a smooth dip underneath for a 0, turning at the end of each
// row to come back along the next one
function wirePath(bits) {
  let d = "";
  for (let row = 0; row < SIZE; row++) {
    const order = Array.from({ length: SIZE }, (_, k) =>
      row % 2 ? row * SIZE + SIZE - 1 - k : row * SIZE + k,
    );
    const dir = row % 2 ? -1 : 1;
    const level = (i) => ringPos(i).cy + (bits[i] ? 0 : DIP);

    order.forEach((ring, k) => {
      const { cx } = ringPos(ring);
      const y = level(ring);
      const enter = cx - dir * HALF;
      const exit = cx + dir * HALF;
      if (row === 0 && k === 0) {
        d += `M ${enter - dir * 14} ${y} L ${enter} ${y}`;
      } else if (k > 0) {
        // (the first ring of later rows is reached by the turn below)
        const prev = order[k - 1];
        const px = ringPos(prev).cx + dir * HALF;
        const py = level(prev);
        const mid = (px + enter) / 2;
        d += ` C ${mid} ${py}, ${mid} ${y}, ${enter} ${y}`;
      }
      d += ` L ${exit} ${y}`;
    });

    // swing round to the start of the next row
    if (row < SIZE - 1) {
      const lastRing = order[SIZE - 1];
      const nextFirst = (row + 1) % 2 ? (row + 1) * SIZE + SIZE - 1 : (row + 1) * SIZE;
      const fromX = ringPos(lastRing).cx + dir * HALF;
      const fromY = level(lastRing);
      const toX = ringPos(nextFirst).cx + dir * HALF;
      const toY = level(nextFirst);
      const bend = fromX + dir * 16;
      d += ` C ${bend} ${fromY}, ${bend} ${toY}, ${toX} ${toY}`;
    } else {
      const lastRing = order[SIZE - 1];
      const endX = ringPos(lastRing).cx + dir * (HALF + 14);
      d += ` L ${endX} ${level(lastRing)}`;
    }
  }
  return d;
}

// a ring holding a 1 is tinted with one of these pastels, by position
const PASTELS = ["#E0BFC2", "#C3D9C6", "#E3CB9A", "#B9CFE0"];

const START = [
  1, 0, 1, 1,
  0, 1, 0, 0,
  1, 1, 0, 1,
  0, 0, 1, 0,
];

export default function CoreRopeTrinket({ x, y, rot = 0, isMobile = false }) {
  const [bits, setBits] = useState(START);
  const [lit, setLit] = useState(null);
  const [fact, setFact] = useState(null);
  const factIndex = useRef(Math.floor(Math.random() * FACTS.length));
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => {
    const pending = timers;
    return () => pending.current.forEach(clearTimeout);
  }, []);

  const nextFact = () => {
    setFact(FACTS[factIndex.current % FACTS.length]);
    factIndex.current += 1;
  };

  const weave = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    // flip one bit
    const flip = Math.floor(Math.random() * bits.length);
    setBits((cur) => cur.map((bit, i) => (i === flip ? 1 - bit : bit)));
    noise(0, { dur: 0.16, peak: 0.03, band: 900, q: 0.8 });

    // then a read pulse runs down the wire, ring by ring. set bits ring
    // a little higher than empty ones
    THREAD.forEach((ring, step) => {
      later(() => {
        setLit(ring);
        const set = ring === flip ? !bits[ring] : bits[ring];
        tone(0, {
          freq: set ? 880 : 440,
          dur: 0.05,
          peak: set ? 0.02 : 0.008,
          type: "triangle",
          filter: 2600,
        });
      }, 180 + step * 55);
    });
    later(() => setLit(null), 180 + THREAD.length * 55 + 120);

    nextFact();
    // on a phone there's no hover to tuck the note away again
    if (isMobile) later(() => setFact(null), 6000);
  };

  // the plane's contents as a little hex word, like a memory dump
  const word = parseInt(bits.join(""), 2).toString(16).padStart(4, "0");

  return (
    <button
      type="button"
      className={`${styles.rope} ${isMobile ? styles.inline : ""}`}
      style={isMobile ? undefined : { left: x, top: y, transform: `rotate(${rot}deg)` }}
      onClick={weave}
      onMouseEnter={isMobile ? undefined : nextFact}
      onMouseLeave={isMobile ? undefined : () => setFact(null)}
      onFocus={nextFact}
      onBlur={() => setFact(null)}
      aria-label="core rope memory, in honor of margaret hamilton: weave a bit"
      aria-describedby={fact ? "core-rope-fact" : undefined}
    >
      <svg viewBox="0 0 180 200" className={styles.svg} aria-hidden="true">
        <rect x="1" y="1" width="178" height="198" rx="10" className={styles.cloth} />

        {/* each ring's back half, then the wire, then the ring's front
            half on top, so the wire looks threaded through */}
        {bits.map((bit, i) => {
          const { cx, cy } = ringPos(i);
          return (
            <ellipse
              key={`back-${i}`}
              cx={cx}
              cy={cy}
              rx="8"
              ry="13"
              fill={bit ? PASTELS[i % PASTELS.length] : "none"}
              className={`${styles.ring} ${lit === i ? styles.ringLit : ""}`}
            />
          );
        })}

        <path d={wirePath(bits)} className={styles.wire} />

        {bits.map((_, i) => {
          const { cx, cy } = ringPos(i);
          return (
            <path
              key={`front-${i}`}
              d={`M ${cx} ${cy - 13} A 8 13 0 0 1 ${cx} ${cy + 13}`}
              className={`${styles.ringFront} ${lit === i ? styles.ringLit : ""}`}
            />
          );
        })}

        <text x="14" y="188" className={styles.label}>
          core · 0x{word}
        </text>
        <text x="166" y="188" textAnchor="end" className={styles.label}>
          for m.h.
        </text>
      </svg>

      {fact && (
        <span id="core-rope-fact" role="tooltip" className={styles.fact}>
          {fact}
        </span>
      )}
    </button>
  );
}
