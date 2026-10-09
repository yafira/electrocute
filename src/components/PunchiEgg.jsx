// punchi: a little pastel egg pet that lives next to the communal punch
// card. its mood follows how full the current card is: sleepy on a
// fresh card, happy halfway, cheering as the last holes go in, and all
// hearts the moment a card is finished. it also gets a heart whenever
// a visitor punches. A feeds it, B pets it, C reads its mood.

import { useEffect, useRef, useState } from "react";
import styles from "../styles/PunchiEgg.module.css";
import { tone } from "../lib/tinySynth";

// 16 × 16 sprites, "#" is a lit pixel
const SPRITES = {
  sleepy: [
    "................",
    "................",
    "......####......",
    "....########....",
    "...##########...",
    "..############..",
    "..#.##.##.##.#..",
    "..############..",
    "..####....####..",
    "..############..",
    "...##########...",
    "....########....",
    "................",
    ".........#......",
    "..........#.....",
    "................",
  ],
  happy: [
    "................",
    "......####......",
    "....########....",
    "...##########...",
    "..############..",
    "..##.######.##..",
    "..############..",
    "..##.######.##..",
    "..###.####.###..",
    "..####....####..",
    "...##########...",
    "....########....",
    ".....#....#.....",
    "................",
    "................",
    "................",
  ],
  glee: [
    "................",
    ".##..........##.",
    "..#.########.#..",
    "...##########...",
    "..############..",
    "..#..######..#..",
    "..############..",
    "..##.######.##..",
    "..###......###..",
    "..####....####..",
    "...##########...",
    "....########....",
    "....#......#....",
    "...#........#...",
    "................",
    "................",
  ],
  heart: [
    "................",
    "................",
    "...###...###....",
    "..#####.#####...",
    "..###########...",
    "..###########...",
    "...#########....",
    "....#######.....",
    ".....#####......",
    "......###.......",
    ".......#........",
    "................",
    "................",
    "................",
    "................",
    "................",
  ],
};

const MOOD_LINES = {
  sleepy: "zzz… a fresh card. punch a hole to wake me.",
  happy: "the card is filling up. i like it here.",
  glee: "so close to a finished card!!",
  heart: "a whole card! off to the archive.",
};

function Sprite({ name }) {
  return (
    <svg viewBox="0 0 16 16" className={styles.screenSvg} aria-hidden="true">
      {SPRITES[name].flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === "#" ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1.02"
              height="1.02"
              className={name === "heart" ? styles.heartPx : styles.px}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

export default function PunchiEgg({ punched, cardSize, justPunched }) {
  const [override, setOverride] = useState(null);
  const [note, setNote] = useState(null);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const full = cardSize > 0 && punched >= cardSize;
  const share = cardSize > 0 ? punched / cardSize : 0;
  const mood = full
    ? "heart"
    : share < 1 / 3
      ? "sleepy"
      : share < 2 / 3
        ? "happy"
        : "glee";

  // a heart for every visitor who punches
  useEffect(() => {
    if (!justPunched) return;
    setOverride("heart");
    later(() => setOverride(null), 1200);
  }, [justPunched]);

  const say = (text) => {
    setNote(text);
    later(() => setNote(null), 3200);
  };

  const feed = () => {
    setOverride("heart");
    later(() => setOverride(null), 900);
    tone(0, { freq: 660, to: 880, dur: 0.08, peak: 0.04 });
    tone(0.06, { freq: 990, to: 1318.5, dur: 0.14, peak: 0.03 });
    say("yum. thank you.");
  };

  const pet = () => {
    [523.25, 659.25, 783.99].forEach((f, i) =>
      tone(i * 0.05, { freq: f, dur: 0.1, peak: 0.025, type: "triangle" }),
    );
    say(mood === "sleepy" ? "mmh… still sleepy." : "purr.");
  };

  const check = () => {
    tone(0, { freq: 880, dur: 0.05, peak: 0.025, type: "square", filter: 2400 });
    say(MOOD_LINES[mood]);
  };

  return (
    <div className={styles.punchi}>
      <div className={styles.egg}>
        <svg viewBox="0 0 112 128" className={styles.shell} aria-hidden="true">
          <path
            d="M56 4 C86 4, 106 44, 106 76 C106 106, 84 124, 56 124 C28 124, 6 106, 6 76 C6 44, 26 4, 56 4 Z"
            className={styles.shellBody}
          />
          <circle cx="56" cy="11" r="3" className={styles.loop} />
          <text x="56" y="29" textAnchor="middle" className={styles.brand}>
            PUNCHI
          </text>
          <rect x="26" y="34" width="60" height="54" rx="10" className={styles.screen} />
        </svg>
        <div
          className={styles.screenArea}
          role="img"
          aria-label={`punchi is ${override || mood}`}
        >
          <Sprite name={override || mood} />
        </div>
        <div className={styles.buttons}>
          <button type="button" onClick={feed} aria-label="A: feed punchi">
            A
          </button>
          <button type="button" onClick={pet} aria-label="B: pet punchi">
            B
          </button>
          <button type="button" onClick={check} aria-label="C: check punchi's mood">
            C
          </button>
        </div>
      </div>
      <p className={styles.note} aria-live="polite">
        {note || " "}
      </p>
    </div>
  );
}
