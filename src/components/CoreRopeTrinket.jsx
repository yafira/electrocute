// a little core memory plane, in honor of margaret hamilton and the
// women who wove apollo's software by hand.
//
// a 4 × 4 grid of ferrite rings with one wire threading through all of
// them, row by row like a knitting carriage. a ring filled with pastel
// is a set bit. clicking flips one bit, then a pulse runs down the wire
// and lights each ring in turn. hovering, or tapping on a phone, shares
// a fact about hamilton, apollo, and the rope weavers.

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
const WIRE = "M " + THREAD.map((i) => `${ringPos(i).cx} ${ringPos(i).cy}`).join(" L ");
// a set bit takes one of these pastels, by position
const PASTELS = ["#E0BFC2", "#C3D9C6", "#E3CB9A", "#B9CFE0"];
const START = [
  0, 1, 0, 0,
  0, 0, 1, 0,
  1, 0, 0, 0,
  0, 0, 0, 1,
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
      <svg viewBox="0 0 180 196" className={styles.svg} aria-hidden="true">
        {/* the threading wire, behind the rings */}
        <path d={WIRE} className={styles.wire} />

        {bits.map((bit, i) => {
          const { cx, cy } = ringPos(i);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="12"
              fill={bit ? PASTELS[i % PASTELS.length] : "none"}
              className={`${styles.ring} ${lit === i ? styles.ringLit : ""}`}
            />
          );
        })}

        <text x="12" y="188" className={styles.label}>
          core · 0x{word}
        </text>
        <text x="168" y="188" textAnchor="end" className={styles.label}>
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
