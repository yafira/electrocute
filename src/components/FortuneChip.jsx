// the fortune chip on the contact page: a little 8-pin chip with a
// paper strip in its side. click it and it prints a generated fortune,
// written by a tracery grammar in the same spirit as the poem deck,
// with a few lucky resistor values underneath. click again and the old
// fortune is torn off before the next one prints.

import { useMemo, useState } from "react";
import tracery from "tracery-grammar";
import styles from "../styles/FortuneChip.module.css";
import { noise, tone } from "../lib/tinySynth";

const grammar = {
  origin: [
    "#subject# #verb# #object#.",
    "#subject# #verb# #object#, and that is enough.",
    "soon, #subject# will #future#.",
    "trust #subject#. it #verb# #object#.",
  ],
  subject: [
    "a loose thread",
    "the coin cell",
    "your next stitch",
    "a quiet capacitor",
    "the knit row",
    "a sleepy led",
    "the conductive yarn",
    "this soft circuit",
    "an unsoldered heart",
    "the punch card",
  ],
  verb: [
    "remembers",
    "is humming toward",
    "dreams of",
    "will carry",
    "forgives",
    "is learning",
    "keeps a pocket for",
    "glows for",
  ],
  object: [
    "the current you gave it",
    "every short circuit",
    "a softer ground",
    "the last hole on the card",
    "what the needle meant",
    "the warmth of your hands",
    "one more row",
    "a signal you already sent",
  ],
  future: [
    "close the loop",
    "find its ground",
    "light up on its own",
    "hold a charge for you",
    "unravel into something better",
  ],
};

// standard E12 resistor values, as they're printed on a parts drawer
const OHMS = ["220", "330", "470", "1k", "2.2k", "4.7k", "10k", "47k", "100k"];

function printSound() {
  // the little thermal printer chattering out the strip
  for (let i = 0; i < 9; i++) {
    noise(i * 0.1, {
      dur: 0.05,
      peak: 0.03,
      band: 2600 + Math.random() * 800,
      q: 3,
    });
  }
  tone(0.95, { freq: 1318.5, dur: 0.08, peak: 0.02 });
}

function tearSound() {
  noise(0, { dur: 0.12, peak: 0.05, band: 1400, q: 0.7 });
}

export default function FortuneChip() {
  const deck = useMemo(() => {
    const g = tracery.createGrammar(grammar);
    g.addModifiers(tracery.baseEngModifiers);
    return g;
  }, []);

  // a counter as the key, so each fortune is a fresh element that
  // plays the print-out animation from the start
  const [fortune, setFortune] = useState(null);
  const [tearing, setTearing] = useState(false);

  const print = () => {
    const pick = () => OHMS[Math.floor(Math.random() * OHMS.length)];
    const next = {
      id: (fortune?.id || 0) + 1,
      line: deck.flatten("#origin#"),
      ohms: [pick(), pick(), pick()].join(" · "),
    };

    if (fortune) {
      setTearing(true);
      tearSound();
      setTimeout(() => {
        setTearing(false);
        setFortune(next);
        printSound();
      }, 380);
    } else {
      setFortune(next);
      printSound();
    }
  };

  return (
    <section className={styles.wrap}>
      <button
        type="button"
        className={styles.chip}
        onClick={print}
        aria-label={fortune ? "print another fortune" : "print a fortune"}
      >
        <svg viewBox="0 0 88 56" className={styles.chipSvg} aria-hidden="true">
          <g className={styles.pins}>
            {[14, 30, 46, 62].map((x) => (
              <g key={x}>
                <rect x={x} y="0" width="5" height="9" />
                <rect x={x} y="47" width="5" height="9" />
              </g>
            ))}
          </g>
          <rect x="4" y="8" width="76" height="40" rx="4" className={styles.body} />
          <circle cx="12" cy="28" r="3.2" className={styles.notch} />
          <text x="44" y="26" textAnchor="middle" className={styles.part}>
            FTN-01
          </text>
          <text x="44" y="37" textAnchor="middle" className={styles.spec}>
            luck · 3v
          </text>
        </svg>
        <span className={styles.label}>
          {fortune ? "another fortune" : "take a fortune"}
        </span>
      </button>

      <div className={styles.tray} aria-live="polite">
        {fortune && (
          <p
            key={fortune.id}
            className={`${styles.paper} ${tearing ? styles.torn : ""}`}
          >
            {fortune.line}
            <small>lucky ohms: {fortune.ohms}</small>
          </p>
        )}
      </div>
    </section>
  );
}
