// a little swatch of core rope memory, in honor of margaret hamilton
// and the women who wove apollo's software by hand.
//
// in core rope memory, copper wire runs either through a tiny magnetic
// ring (a 1) or around it (a 0), so the program is literally woven into
// the hardware. here, three wires run past six rings. clicking weaves a
// new bit (one wire switches between through and around one ring) and
// a pulse runs down that wire, lighting every ring it passes through.
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

const RINGS = 6;
const RING_X = (i) => 20 + i * 24;
const RING_Y = 40;
// where each wire crosses the rings, and which way it bows to go around
const WIRES = [
  { y: RING_Y - 3, bow: -1, color: "#c98b5f" },
  { y: RING_Y, bow: 1, color: "#d9a066" },
  { y: RING_Y + 3, bow: -1, color: "#b9774f" },
];
const START = [
  [1, 0, 1, 1, 0, 1],
  [0, 1, 1, 0, 1, 0],
  [1, 1, 0, 0, 1, 1],
];

function wirePath(bits, { y, bow }) {
  let d = `M 2 ${y}`;
  bits.forEach((bit, i) => {
    const cx = RING_X(i);
    if (bit) {
      // straight through the middle of the ring
      d += ` L ${cx + 11} ${y}`;
    } else {
      // loop around the outside of the ring
      d += ` L ${cx - 12} ${y} Q ${cx} ${y + bow * 34} ${cx + 12} ${y}`;
    }
  });
  return `${d} L 158 ${y}`;
}

export default function CoreRopeTrinket({ x, y, rot = 0, isMobile = false }) {
  const [bits, setBits] = useState(START);
  const [lit, setLit] = useState([]);
  const [active, setActive] = useState(null);
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
    const w = Math.floor(Math.random() * WIRES.length);
    const r = Math.floor(Math.random() * RINGS);
    const next = bits.map((row) => [...row]);
    next[w][r] = next[w][r] ? 0 : 1;
    setBits(next);
    setActive(w);

    // the thread pulling through
    noise(0, { dur: 0.18, peak: 0.03, band: 900, q: 0.8 });

    // then a pulse runs down the wire, ringing each core it passes through
    const through = next[w]
      .map((bit, i) => (bit ? i : null))
      .filter((i) => i !== null);
    through.forEach((i, step) => {
      later(() => {
        setLit((cur) => [...cur, i]);
        tone(0, {
          freq: 520 + i * 70,
          dur: 0.07,
          peak: 0.02,
          type: "triangle",
          filter: 2600,
        });
      }, 200 + step * 110);
    });
    later(() => {
      setLit([]);
      setActive(null);
    }, 200 + through.length * 110 + 450);

    nextFact();
    // on a phone there's no hover to tuck the note away again
    if (isMobile) later(() => setFact(null), 6000);
  };

  const wordLabel = (active === null ? bits[0] : bits[active]).join("");

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
      <svg viewBox="0 0 160 92" className={styles.svg} aria-hidden="true">
        <rect x="1" y="1" width="158" height="90" rx="8" className={styles.cloth} />

        {/* the rings sit behind the wires */}
        {Array.from({ length: RINGS }, (_, i) => (
          <ellipse
            key={i}
            cx={RING_X(i)}
            cy={RING_Y}
            rx="8"
            ry="10"
            className={`${styles.ring} ${lit.includes(i) ? styles.ringLit : ""}`}
          />
        ))}

        {WIRES.map((wire, w) => (
          <path
            key={w}
            d={wirePath(bits[w], wire)}
            stroke={wire.color}
            className={`${styles.wire} ${active === w ? styles.wireActive : ""}`}
          />
        ))}

        {/* the front edge of each ring, drawn over the wires so the ones
            going through look threaded */}
        {Array.from({ length: RINGS }, (_, i) => (
          <path
            key={`front-${i}`}
            d={`M ${RING_X(i) - 8} ${RING_Y} A 8 10 0 0 0 ${RING_X(i) + 8} ${RING_Y}`}
            className={`${styles.ringFront} ${lit.includes(i) ? styles.ringLit : ""}`}
          />
        ))}

        <text x="10" y="84" className={styles.label}>
          core rope · {wordLabel}
        </text>
        <text x="150" y="84" textAnchor="end" className={styles.label}>
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
