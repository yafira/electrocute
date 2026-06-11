import { useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import tracery from "tracery-grammar";
import styles from "../styles/PoemDeck.module.css";

const grammar = {
  origin: [
    "the #machine# #verb#s in #color#",
    "#somewhere#, #machine.a# is #gerund#",
    "i taught #machine.a# to #verb#",
    "every #machine# remembers #memory#",
    "#color.capitalize# is the sound #machine.a# makes when it #verb#s",
    "the #machine# dreams of #memory#",
    "be patient — the #machine# is still #gerund#",
    "#somewhere#, #memory# waits in #color#",
    "at #time#, the #machine# begins #gerund#",
    "the #machine# feels like #texture# tonight",
    "#memory#, stored in #texture#",
    "#machine.a# made of #texture# and #color#",
    "#somewhere#, #time# never ends",
    "the #machine# hums a poem about #memory#",
    "press gently — the #machine# is #gerund#",
    "#color#, #texture#, and one #machine#, #gerund#",
  ],
  machine: [
    "soft computer",
    "knitting machine",
    "modem",
    "circuit",
    "e-ink moon",
    "thermal printer",
    "little motor",
    "loom",
    "cursor",
    "felt key",
    "pocket deck",
    "velvet capacitor",
    "punch card",
    "tiny speaker",
    "haptic heart",
  ],
  verb: [
    "hum",
    "bloom",
    "whisper",
    "wait",
    "glow",
    "unravel",
    "blink",
    "purr",
    "drift",
    "shimmer",
    "soften",
    "remember",
    "flicker",
    "breathe",
  ],
  gerund: [
    "dreaming",
    "booting",
    "blooming",
    "listening",
    "unspooling",
    "waking up slowly",
    "counting stitches",
    "warming up",
    "saving something precious",
    "humming to itself",
    "knitting the next row",
    "buffering tenderly",
  ],
  color: [
    "lavender",
    "static gray",
    "blush",
    "the softest black",
    "e-ink white",
    "dial-tone blue",
    "butter yellow",
    "moonlight mint",
    "thermal-paper cream",
    "midnight velvet",
  ],
  memory: [
    "the dial-up song",
    "a dropped stitch",
    "the first poem it printed",
    "warm hands",
    "the away message",
    "a finite memory",
    "the shape of your touch",
    "the family computer",
    "a mixtape never finished",
    "the smell of new electronics",
    "every saved game",
    "a flower pressed between two layers of felt",
  ],
  somewhere: [
    "under the felt keys",
    "between two rows of knitting",
    "at the bottom of the void",
    "inside the lavender pouch",
    "after the last receipt",
    "in the quiet after boot",
    "behind the speaker grille",
    "where the solder cooled",
    "two stitches past midnight",
  ],
  texture: [
    "wool and copper",
    "velostat",
    "conductive thread",
    "warm plastic",
    "brushed felt",
    "static cling",
    "soft silicone",
  ],
  time: [
    "3am",
    "the last save point",
    "golden hour",
    "the second boot chime",
    "row 47",
    "the quiet hour",
  ],
};

const voidGrammar = {
  origin: [
    "the #machine# #verb#s in #color#",
    "#somewhere#, #machine.a# is #gerund#",
    "every #machine# remembers #memory#",
    "the #machine# dreams of #memory#",
    "#somewhere#, #memory# waits in #color#",
    "at #time#, the #machine# begins #gerund#",
    "#memory#, stored in #texture#",
    "the #machine# hums a dirge about #memory#",
    "do not wake the #machine# — it is #gerund#",
    "#color#, #texture#, and one #machine#, #gerund#",
    "nothing here but #machine.a#, #gerund#",
  ],
  machine: [
    "dead modem",
    "cold circuit",
    "obsidian loom",
    "ghost cursor",
    "midnight printer",
    "velvet machine",
    "static engine",
    "iron lung of the internet",
    "forgotten punch card",
    "black-box heart",
  ],
  verb: [
    "flicker",
    "dim",
    "echo",
    "rust",
    "haunt",
    "smolder",
    "wane",
    "hum in minor",
    "dissolve",
  ],
  gerund: [
    "powering down",
    "unraveling",
    "haunting the buffer",
    "fading to static",
    "dreaming in grayscale",
    "keeping vigil",
    "archiving the dark",
    "humming a requiem",
  ],
  color: [
    "the softest black",
    "void violet",
    "static",
    "tarnished silver",
    "candle smoke",
    "crt phosphor green",
    "ink",
    "a black that remembers being lavender",
  ],
  memory: [
    "the last dial tone",
    "a deleted file",
    "the blue screen",
    "an unsent message",
    "the cursor that never blinked again",
    "a corrupted save",
    "the hum of a dead hard drive",
    "every closed tab",
  ],
  somewhere: [
    "at the bottom of the void",
    "behind the dead pixels",
    "in the recycle bin",
    "after the last shutdown",
    "between two power outages",
    "where the signal drops",
    "in the unlit corner of the archive",
  ],
  texture: [
    "cold solder",
    "black lace",
    "burnt copper",
    "dead velvet",
    "frayed ribbon cable",
    "graphite dust",
  ],
  time: [
    "the witching hour",
    "3:33am",
    "the final boot",
    "the last autosave",
    "midnight, twice",
  ],
};

const softG = tracery.createGrammar(grammar);
softG.addModifiers(tracery.baseEngModifiers);
const voidG = tracery.createGrammar(voidGrammar);
voidG.addModifiers(tracery.baseEngModifiers);

const flatten = (mode) => (mode === "void" ? voidG : softG).flatten("#origin#");

export default function PoemDeck({ onClose }) {
  const [mode, setMode] = useState("soft");
  const [line, setLine] = useState(() => flatten("soft"));
  const [tick, setTick] = useState(0);
  const dragControls = useDragControls();

  const generate = () => {
    setLine(flatten(mode));
    setTick((t) => t + 1);
  };

  const toggleMode = () => {
    const next = mode === "soft" ? "void" : "soft";
    setMode(next);
    setLine(flatten(next));
    setTick((t) => t + 1);
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className={`${styles.deck} ${mode === "void" ? styles.void : ""}`}
      role="dialog"
      aria-label="poetronics poem device"
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.7, rotate: -3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      <div
        className={styles.titlebar}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <span className={styles.led} />
        <span className={styles.title}>poetronics://</span>
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="close poem device"
        >
          ✕
        </button>
      </div>

      <div className={styles.screen}>
        <p key={tick} className={styles.line} aria-live="polite">
          {line}
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.dialCluster} aria-hidden="true">
          <span className={styles.dial} />
          <span className={`${styles.dial} ${styles.dialSmall}`} />
        </div>

        <button className={styles.key} onClick={generate}>
          brew ✿
        </button>

        <div className={styles.sideCluster}>
          <button
            className={`${styles.modeSwitch} ${
              mode === "void" ? styles.modeVoid : ""
            }`}
            onClick={toggleMode}
            aria-label={`switch to ${mode === "soft" ? "void" : "soft"} mode`}
            title={mode === "soft" ? "soft mode" : "void mode"}
          >
            <span className={styles.modeNub} />
          </button>
          <div className={styles.grille} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <p className={styles.credit}>
        generated with kate compton&apos;s{" "}
        <a href="https://tracery.io" target="_blank" rel="noreferrer">
          tracery
        </a>
      </p>
    </motion.div>
  );
}
