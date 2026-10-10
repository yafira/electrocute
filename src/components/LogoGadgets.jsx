// two trinkets that live in the gap under the logo, left of the sewn nav:
// the front panel of an old dial-up modem, and a tiny moth.
//
// the modem's data lights blink whenever you click anywhere on the page,
// and clicking the modem itself dials in (dial tone, the number, the
// answer tone, the screech) while the lights come on one by one.
//
// the moth rests near the "e". when the breadboard button powers the
// logo (see powerSurge.js) it flies up to the light and keeps fluttering
// around it until the power goes off, then drifts back down. clicking
// it makes it flit somewhere else.

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/LogoGadgets.module.css";
import { onPower } from "../lib/powerSurge";
import { tone, noise } from "../lib/tinySynth";

// the real front-panel labels of an external modem
const LIGHTS = ["HS", "AA", "CD", "OH", "RD", "SD", "TR", "MR"];
const LIT = {
  HS: "#ff9ad5",
  AA: "#b2a4d4",
  CD: "#94e8c8",
  OH: "#ffd27a",
  RD: "#ff9ad5",
  SD: "#ff9ad5",
  TR: "#94e8c8",
  MR: "#94e8c8",
};
// terminal ready + modem ready stay on, like a modem that's plugged in
const IDLE = { TR: true, MR: true };

// touch-tone pairs for the number it dials
const DTMF = {
  0: [941, 1336],
  1: [697, 1209],
  2: [697, 1336],
  3: [697, 1477],
  5: [770, 1336],
  9: [852, 1477],
};

function playHandshake() {
  // dial tone
  tone(0, { freq: 350, dur: 0.45, peak: 0.02 });
  tone(0, { freq: 440, dur: 0.45, peak: 0.02 });
  // 555-0199
  "5550199".split("").forEach((d, i) => {
    const [lo, hi] = DTMF[d];
    const t = 0.55 + i * 0.11;
    tone(t, { freq: lo, dur: 0.07, peak: 0.025 });
    tone(t, { freq: hi, dur: 0.07, peak: 0.025 });
  });
  // the other end picks up
  tone(1.45, { freq: 2100, dur: 0.45, peak: 0.02 });
  // the screech: carrier tones trading places with bursts of noise
  for (let i = 0; i < 14; i++) {
    const t = 1.95 + i * 0.07;
    if (i % 2) {
      tone(t, {
        freq: 1200 + Math.random() * 1200,
        dur: 0.07,
        peak: 0.018,
        type: "square",
        filter: 3000,
      });
    } else {
      noise(t, { dur: 0.07, peak: 0.05, band: 1800 + Math.random() * 1600, q: 2 });
    }
  }
  noise(2.95, { dur: 0.5, peak: 0.025, band: 1500, q: 0.6 });
}

export function ModemTrinket({ x, y, rot = 0 }) {
  const [lights, setLights] = useState(IDLE);
  const dialing = useRef(false);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const set = (patch) => setLights((cur) => ({ ...cur, ...patch }));

  // receive/send blink for a moment, like a packet going by
  const blip = useCallback(() => {
    if (dialing.current) return;
    set({ RD: true });
    later(() => set({ SD: true, RD: false }), 70);
    later(() => set({ SD: false, RD: Math.random() > 0.5 }), 140);
    later(() => set({ RD: false }), 210);
  }, []);

  useEffect(() => {
    const pending = timers;
    window.addEventListener("pointerdown", blip);
    return () => {
      window.removeEventListener("pointerdown", blip);
      pending.current.forEach(clearTimeout);
    };
  }, [blip]);

  const dial = () => {
    if (dialing.current) return;
    dialing.current = true;
    set({ OH: true });
    playHandshake();

    const flicker = setInterval(
      () => set({ RD: Math.random() > 0.4, SD: Math.random() > 0.4 }),
      60,
    );
    timers.current.push(flicker);
    later(() => set({ CD: true }), 1950);
    later(() => set({ HS: true }), 2400);
    later(() => set({ AA: true }), 2950);
    later(() => {
      clearInterval(flicker);
      setLights(IDLE);
      dialing.current = false;
    }, 4600);
  };

  return (
    <button
      type="button"
      className={styles.modem}
      style={{ left: x, top: y, transform: `rotate(${rot}deg)` }}
      onClick={dial}
      aria-label="dial-up modem: dial in"
    >
      <svg viewBox="0 0 230 58" className={styles.modemSvg} aria-hidden="true">
        <rect
          x="1"
          y="6"
          width="228"
          height="46"
          rx="9"
          className={styles.modemBody}
        />
        <rect x="1" y="40" width="228" height="12" rx="6" className={styles.modemLip} />
        {LIGHTS.map((label, i) => {
          const cx = 22 + i * 26;
          return (
            <g key={label}>
              <circle
                cx={cx}
                cy="20"
                r="4"
                fill={lights[label] ? LIT[label] : "#d9d2c0"}
                stroke="#bfb59c"
                strokeWidth="0.8"
                className={lights[label] ? styles.lit : undefined}
                style={lights[label] ? { color: LIT[label] } : undefined}
              />
              <text x={cx} y="34" textAnchor="middle" className={styles.modemLabel}>
                {label}
              </text>
            </g>
          );
        })}
        <text x="12" y="49" className={styles.modemBrand}>
          28.8 · soft modem
        </text>
      </svg>
    </button>
  );
}

// fun facts the moth shares when you hover over it: the first
// computer "bug", grace hopper, and moths themselves
const MOTH_FACTS = [
  "sept 9, 1947: operators of the harvard mark II found a moth stuck in relay #70 and taped it into the logbook as the \"first actual case of bug being found.\"",
  "that logbook, moth and all, now lives at the smithsonian's national museum of american history.",
  "a heisenbug is a bug that vanishes or changes the moment you try to look at it. it's named after heisenberg's uncertainty principle.",
  "even ada lovelace's 1843 program, often called the first ever published, had a bug: one step in her table used the wrong variables.",
  "grace hopper handed out \"nanoseconds\": 11.8-inch pieces of wire, the distance light travels in one billionth of a second.",
  "in 1952 grace hopper built the A-0 system, one of the very first compilers. her later work led to COBOL.",
  "grace hopper retired from the navy as a rear admiral. people called her \"amazing grace.\"",
  "silk comes from a moth: the silkworm, bombyx mori, spins its cocoon from one single thread that can run 900 meters long.",
  "moths don't aim for lamps. they tilt their backs toward the brightest thing, mistaking it for the sky, and get stuck circling.",
];

function flutterSound() {
  for (let i = 0; i < 6; i++) {
    tone(i * 0.09, {
      freq: 180 + Math.random() * 40,
      dur: 0.05,
      peak: 0.006,
      type: "triangle",
      filter: 900,
    });
  }
}

export function MothTrinket({ x, y }) {
  const ref = useRef(null);
  // null means "at rest", at the x/y it was placed at
  const [spot, setSpot] = useState(null);
  const [flying, setFlying] = useState(false);
  const powered = useRef(false);
  const timers = useRef([]);
  // which fact to show, moving on to the next one on every hover
  const [fact, setFact] = useState(null);
  const factIndex = useRef(Math.floor(Math.random() * MOTH_FACTS.length));

  const showFact = () => {
    setFact(MOTH_FACTS[factIndex.current % MOTH_FACTS.length]);
    factIndex.current += 1;
  };
  const hideFact = () => setFact(null);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // a random spot on the lower half of the logo, measured against the
  // same box the moth is positioned in
  const nearTheLight = () => {
    const el = ref.current;
    const logo = document.querySelector("h1");
    if (!el || !logo || !el.offsetParent) return null;
    const box = el.offsetParent.getBoundingClientRect();
    const glow = logo.getBoundingClientRect();
    return {
      left: glow.left - box.left + glow.width * (0.08 + Math.random() * 0.5),
      top: glow.top - box.top + glow.height * (0.45 + Math.random() * 0.3),
    };
  };

  const flyTo = useCallback((next) => {
    setFlying(true);
    setSpot(next);
    flutterSound();
    timers.current.push(setTimeout(() => setFlying(false), 1150));
  }, []);

  // while the logo is lit, hop around it every couple of seconds
  const circleTheLight = useCallback(() => {
    if (!powered.current) return;
    const target = nearTheLight();
    if (target) flyTo(target);
    timers.current.push(setTimeout(circleTheLight, 2200 + Math.random() * 1800));
  }, [flyTo]);

  useEffect(() => {
    const off = onPower((on) => {
      powered.current = on;
      clear();
      if (on) {
        // wait for the current to reach the logo before taking off
        timers.current.push(setTimeout(circleTheLight, 450));
      } else {
        flyTo(null);
      }
    });
    return () => {
      off();
      clear();
    };
  }, [circleTheLight, flyTo]);

  const shoo = () => {
    if (powered.current) {
      const target = nearTheLight();
      if (target) flyTo(target);
      return;
    }
    const el = ref.current;
    if (!el) return;
    flyTo({
      left: el.offsetLeft + (Math.random() - 0.5) * 220,
      top: el.offsetTop + (Math.random() - 0.5) * 70,
    });
  };

  const style = spot
    ? { left: spot.left, top: spot.top }
    : { left: x, top: y };

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.moth} ${flying ? styles.flying : ""}`}
      style={style}
      onClick={() => {
        hideFact();
        shoo();
      }}
      onMouseEnter={showFact}
      onMouseLeave={hideFact}
      onFocus={showFact}
      onBlur={hideFact}
      aria-label="tiny moth: shoo it"
      aria-describedby={fact ? "moth-fact" : undefined}
    >
      {fact && !flying && (
        <span id="moth-fact" role="tooltip" className={styles.fact}>
          {fact}
        </span>
      )}
      <svg viewBox="0 0 54 40" className={styles.mothSvg} aria-hidden="true">
        <g className={`${styles.wing} ${styles.wingLeft}`}>
          <path
            d="M26 18 C14 2, 2 4, 3 16 C4 24, 16 24, 26 20 Z"
            fill="#d9cff3"
            stroke="#b2a4d4"
            strokeWidth="1"
          />
          <path
            d="M26 21 C17 24, 9 30, 13 35 C17 39, 24 30, 26 23 Z"
            fill="#e6def8"
            stroke="#b2a4d4"
            strokeWidth="1"
          />
          <circle cx="11" cy="14" r="2.6" fill="#b2a4d4" />
        </g>
        <g className={`${styles.wing} ${styles.wingRight}`}>
          <path
            d="M28 18 C40 2, 52 4, 51 16 C50 24, 38 24, 28 20 Z"
            fill="#d9cff3"
            stroke="#b2a4d4"
            strokeWidth="1"
          />
          <path
            d="M28 21 C37 24, 45 30, 41 35 C37 39, 30 30, 28 23 Z"
            fill="#e6def8"
            stroke="#b2a4d4"
            strokeWidth="1"
          />
          <circle cx="43" cy="14" r="2.6" fill="#b2a4d4" />
        </g>
        <ellipse
          cx="27"
          cy="21"
          rx="3.4"
          ry="9"
          fill="#efe6d6"
          stroke="#c9b8a0"
          strokeWidth="0.8"
        />
        <path
          d="M25.5 12 C23 6, 20 4, 18 4 M28.5 12 C31 6, 34 4, 36 4"
          fill="none"
          stroke="#8b8271"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
