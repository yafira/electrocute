"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../styles/Poetronics.module.css";

const items = [
  {
    slug: "petalbyte",
    title: "petalbyte",
    image: "/assets/craft/petalbyte.png",
    href: "https://months-tap-da9.craft.me/petalbyte",
    blurb:
      "a flower-shaped USB drive that archives personal writing and grows new fragments from it.",
    pos: { x: "20%", y: "10%", w: 260, rot: -6, delay: 0 },
    corpus: {
      openers: ["the archive", "a saved draft", "the flower"],
      closers: [
        "was never meant to be deleted",
        "generates its own next line",
        "only opens when you plug it in",
      ],
    },
  },
  {
    slug: "the-soft-computer",
    title: "the soft computer",
    image: "/assets/craft/the-soft-computer.png",
    href: "https://thesoft.computer/",
    blurb:
      "a textile computing object exploring calm technology and anti-optimization.",
    pos: { x: "78%", y: "14%", w: 300, rot: 3, delay: 0.6 },
    corpus: {
      openers: ["a slow machine", "the felt", "this quiet cavity"],
      closers: [
        "thinks without hurrying",
        "holds four kinds of memory",
        "waits to be touched",
      ],
    },
  },
  {
    slug: "ribbon-logic",
    title: "ribbon logic",
    image: "/assets/craft/ribbon-logic.png",
    href: "https://months-tap-da9.craft.me/ribbon-logic",
    blurb: "reasoning stitched into a length of ribbon, one loop at a time.",
    pos: { x: "12%", y: "42%", w: 270, rot: -4, delay: 1.8 },
    corpus: {
      openers: ["a ribbon", "the loop", "a single thread"],
      closers: [
        "argues in soft loops",
        "ties reason to its tail",
        "folds a decision in half",
      ],
    },
  },
  {
    slug: "moonpocket",
    title: "moonpocket",
    image: "/assets/craft/moonpocket.png",
    href: "https://months-tap-da9.craft.me/moonpocket",
    blurb:
      "a small pocket that keeps a sliver of moonlight, and a circuit, close.",
    pos: { x: "46%", y: "40%", w: 275, rot: 2, delay: 0.9 },
    corpus: {
      openers: ["the pocket", "a sliver of moon", "this small dark"],
      closers: [
        "waits by your hip",
        "tides with your walking",
        "keeps its glow low",
      ],
    },
  },
  {
    slug: "pocket-oracle-of-time",
    title: "pocket oracle of time",
    image: "/assets/craft/pocket-oracle-of-time.png",
    href: "https://months-tap-da9.craft.me/oracle",
    blurb:
      "a small e-ink oracle that offers a quiet poem instead of the time — no button, no rush.",
    pos: { x: "80%", y: "58%", w: 230, rot: 5, delay: 1.2 },
    corpus: {
      openers: ["the oracle", "the e-ink face", "the hour"],
      closers: [
        "speaks once and holds its silence",
        "cannot be rushed into an answer",
        "shows the time only when it chooses to",
      ],
    },
  },
  {
    slug: "tendertronic",
    title: "tendertronic",
    image: "/assets/craft/tendertronic1.png",
    hoverImage: "/assets/craft/tendertronic2.png",
    href: "https://months-tap-da9.craft.me/tendertronic",
    blurb:
      "an analog synth that's sharp and loud by nature — the softness is in how patiently you tune it.",
    pos: { x: "28%", y: "74%", w: 280, rot: -10, delay: 2.1 },
    corpus: {
      openers: ["the circuit", "an untuned oscillator", "the loudest knob"],
      closers: [
        "only settles for a patient hand",
        "resists being rushed into rhythm",
        "stays sharp until you learn to listen",
      ],
    },
  },
];

const moonPositions = [
  { left: "6%", top: "4%", phase: "crescent", dur: "24s" },
  { left: "90%", top: "3%", phase: "full", dur: "18s" },
  { left: "68%", top: "48%", phase: "crescent", dur: "26s" },
];

// the shared corpus the text engine draws from — every project's
// openers/closers pooled together, so feeding it a word mixes your
// language in with all six pieces at once.
const POOL_OPENERS = items.flatMap((i) => i.corpus.openers);
const POOL_CLOSERS = items.flatMap((i) => i.corpus.closers);

const TYPE_SPEED = 28; // ms per character
const MAX_LOG = 5;

// takes whatever the person typed, folds a word from it into a line
// pulled from the pooled corpus — a tiny stand-in for the order-3
// markov chain in petalbyte, just simple enough to run in the browser.
function generateFromInput(raw) {
  const words = raw.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const opener = words.length
    ? words[Math.floor(Math.random() * words.length)]
    : POOL_OPENERS[Math.floor(Math.random() * POOL_OPENERS.length)];

  const closer = POOL_CLOSERS[Math.floor(Math.random() * POOL_CLOSERS.length)];

  const capped = opener.charAt(0).toUpperCase() + opener.slice(1);
  return `${capped} ${closer}.`;
}

function placeholderImg(title) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="240">` +
    `<rect width="300" height="240" fill="#241a3f"/>` +
    `<text x="150" y="125" font-family="monospace" font-size="14" fill="#cbb8f2" text-anchor="middle">${title}</text>` +
    `</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function MoonIcon({ phase }) {
  if (phase === "crescent") {
    return (
      <svg width="46" height="46" viewBox="0 0 46 46">
        <defs>
          <mask id={`moonmask-${phase}`}>
            <rect width="46" height="46" fill="white" />
            <circle cx="30" cy="18" r="15" fill="black" />
          </mask>
        </defs>
        <circle
          cx="23"
          cy="23"
          r="18"
          fill="#e3d6fb"
          mask={`url(#moonmask-${phase})`}
        />
      </svg>
    );
  }
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r="13" fill="#f3eefc" opacity="0.85" />
    </svg>
  );
}

// the text engine: a small console fixed near the bottom of the page.
// type a word or a phrase, hit enter, and it feeds into the pooled
// corpus — the response types itself out, then joins a short scrolling
// log above the input.
function TextEngine() {
  const [value, setValue] = useState("");
  const [log, setLog] = useState([]); // finished lines, newest last
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const runLine = (line) => {
    setIsTyping(true);
    setTypingText("");
    let i = 0;
    const tick = () => {
      i += 1;
      setTypingText(line.slice(0, i));
      if (i < line.length) {
        timeoutRef.current = setTimeout(tick, TYPE_SPEED);
      } else {
        setIsTyping(false);
        setLog((prev) => [...prev, line].slice(-MAX_LOG));
        setTypingText("");
      }
    };
    timeoutRef.current = setTimeout(tick, TYPE_SPEED);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTyping) return;
    const line = generateFromInput(value);
    setValue("");
    runLine(line);
  };

  return (
    <div className={styles.engine}>
      <div className={styles.engineLog} aria-live="polite">
        {log.map((line, i) => (
          <p key={i} className={styles.engineLine}>
            {line}
          </p>
        ))}
        {(isTyping || typingText) && (
          <p className={styles.engineLine}>
            {typingText}
            <span className={styles.caret}>▍</span>
          </p>
        )}
      </div>
      <form className={styles.engineForm} onSubmit={handleSubmit}>
        <span className={styles.enginePrompt}>✦</span>
        <input
          ref={inputRef}
          className={styles.engineInput}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="feed the engine a word..."
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className={styles.engineButton}
          disabled={isTyping}
        >
          generate
        </button>
      </form>
    </div>
  );
}

export default function Poetronics() {
  const [stars, setStars] = useState([]);
  const [hoveredSlug, setHoveredSlug] = useState(null); // for tendertronic image swap only
  const [active, setActive] = useState(null); // { item }

  useEffect(() => {
    setStars(
      Array.from({ length: 70 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: (Math.random() * 4).toFixed(2),
        size: (3 + Math.random() * 5).toFixed(1),
      })),
    );
  }, []);

  const handleClick = (item) => (e) => {
    e.preventDefault();
    setActive({ item });
  };

  return (
    <div className={styles.page}>
      <div className={styles.sky} aria-hidden="true">
        {stars.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
              fontSize: `${s.size}px`,
            }}
          />
        ))}
        {moonPositions.map((m, i) => (
          <div
            key={i}
            className={styles.moonDeco}
            style={{ left: m.left, top: m.top, animationDuration: m.dur }}
          >
            <MoonIcon phase={m.phase} />
          </div>
        ))}
      </div>

      <header className={styles.header}>
        <a className={styles.eyebrow} href="/">
          ← back to electrocute lab
        </a>
        <h1 className={styles.title}>poetronics</h1>
        <p className={styles.tagline}>
          soft machines under a borrowed moon — circuits that write, stitch, and
          remember. feed the engine below a word and see what it grows.
        </p>
      </header>

      <div className={styles.collage}>
        {items.map((item) => (
          <a
            key={item.slug}
            className={styles.card}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              left: item.pos.x,
              top: item.pos.y,
              width: item.pos.w,
              animationDelay: `${item.pos.delay}s`,
              transform: `rotate(${item.pos.rot}deg)`,
            }}
            onMouseEnter={() => {
              if (item.hoverImage) setHoveredSlug(item.slug);
            }}
            onMouseLeave={() => {
              if (item.hoverImage) setHoveredSlug(null);
            }}
            onClick={handleClick(item)}
          >
            <span className={styles.cardInner}>
              <span className={styles.cardPin} />
              <img
                className={styles.cardImg}
                src={
                  item.hoverImage && hoveredSlug === item.slug
                    ? item.hoverImage
                    : item.image
                }
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = placeholderImg(item.title);
                }}
              />
              <span className={styles.cardTitle}>{item.title}</span>
            </span>
          </a>
        ))}
      </div>

      <div className={`${styles.label} ${active ? styles.show : ""}`}>
        {active && (
          <>
            <div className={styles.labelHead}>
              <h3 className={styles.labelName}>{active.item.title}</h3>
              <button
                className={styles.labelClose}
                onClick={() => setActive(null)}
                aria-label="close"
              >
                ✕
              </button>
            </div>
            <p className={styles.labelBlurb}>{active.item.blurb}</p>
            <div className={styles.labelFoot}>
              <a
                className={styles.labelLink}
                href={active.item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                visit ↗
              </a>
            </div>
          </>
        )}
      </div>

      <TextEngine />
    </div>
  );
}
