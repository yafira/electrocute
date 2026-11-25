// the ambience for the whole site. a potentiometer on the breadboard
// (read over bluetooth, see lib/bluetoothLink) washes the page through
// the lab palette (paper, blush, butter, matcha, wisteria), dims into
// evening, and at the very end the lights go out and the lab turns goth.
// the pot only counts while the circuit is on. remembered per device.

import { useEffect, useRef, useState } from "react";
import styles from "../styles/SoftPot.module.css";

const LOCAL_KEY = "electrocute:softpot";
const CIRCUIT_KEY = "electrocute:circuit"; // same key index.js uses
export const DIAL_EVENT = "electrocute:ambience";
export const CIRCUIT_EVENT = "electrocute:circuit-change";

// palette stops along the dial, 0 -> 1
const STOPS = [
  { at: 0.0, color: "#fbfcf5", label: "paper" },
  { at: 0.18, color: "#fff3f8", label: "blush" },
  { at: 0.36, color: "#fffee9", label: "butter" },
  { at: 0.54, color: "#f3faea", label: "matcha" },
  { at: 0.7, color: "#f4f0ff", label: "wisteria" },
  { at: 0.86, color: "#efe9ff", label: "evening" },
  { at: 0.93, color: "#e4dcf7", label: "evening" },
];

// past this point the lights go out: black page, dark cards
const GOTH_AT = 0.93;

const labelFor = (v) => (v >= GOTH_AT ? "goth" : sample(v).label);

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function sample(v) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const lo = STOPS[i];
    const hi = STOPS[i + 1];
    if (v <= hi.at) {
      const t = (v - lo.at) / (hi.at - lo.at);
      return {
        color: mix(lo.color, hi.color, Math.max(0, Math.min(1, t))),
        label: t < 0.5 ? lo.label : hi.label,
      };
    }
  }
  return { color: STOPS.at(-1).color, label: STOPS.at(-1).label };
}

function applyAmbience(v) {
  const goth = v >= GOTH_AT;
  const root = document.documentElement;
  // set as a custom property (a normal stylesheet value) rather than
  // an inline background-color — an inline style always wins over
  // any CSS rule regardless of specificity, which meant this used to
  // silently override void mode's black background on every mount.
  root.style.setProperty("--ambience-bg", goth ? "#0e0c12" : sample(v).color);
  // evening pulls dusk over everything, then it lifts once it's goth
  // (the dark styles take over from there)
  const dusk = goth ? 0 : Math.max(0, Math.min(1, (v - 0.7) / 0.23));
  root.style.setProperty("--dusk", dusk.toFixed(3));
  document.body.classList.toggle("ecute-dark", goth);
}

function clearAmbience() {
  document.body.classList.remove("ecute-dark");
  document.documentElement.style.removeProperty("--ambience-bg");
  document.documentElement.style.removeProperty("--dusk");
}

const savedAmbience = () => {
  const saved = parseFloat(localStorage.getItem(LOCAL_KEY));
  return Number.isFinite(saved) ? saved : 0;
};

// called by the bluetooth link with the pot's raw reading, 0 to 1023.
// ignored while the circuit is off, so the last ambience just stays put
export function dialAmbience(raw) {
  if (localStorage.getItem(CIRCUIT_KEY) !== "on") return;
  const v = Math.max(0, Math.min(1, raw / 1023));
  applyAmbience(v);
  localStorage.setItem(LOCAL_KEY, String(v));
  window.dispatchEvent(new CustomEvent(DIAL_EVENT, { detail: v }));
}

// for pages that are dressed for every ambience but don't carry the
// dial themselves (about, contact, shop): they follow whatever it was
// last set to, and hand the lights back when you leave
export function useAmbience() {
  useEffect(() => {
    applyAmbience(savedAmbience());
    return clearAmbience;
  }, []);
}

export default function SoftPot() {
  const [value, setValue] = useState(0);
  const [label, setLabel] = useState("paper");
  const [showLabel, setShowLabel] = useState(false);
  const [circuitOn, setCircuitOn] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    const v = savedAmbience();
    setValue(v);
    setLabel(labelFor(v));
    setCircuitOn(localStorage.getItem(CIRCUIT_KEY) === "on");
    applyAmbience(v);

    const onDial = (event) => {
      setValue(event.detail);
      setLabel(labelFor(event.detail));
      setShowLabel(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setShowLabel(false), 1200);
    };
    const onCircuit = () =>
      setCircuitOn(localStorage.getItem(CIRCUIT_KEY) === "on");

    window.addEventListener(DIAL_EVENT, onDial);
    window.addEventListener(CIRCUIT_EVENT, onCircuit);

    return () => {
      window.removeEventListener(DIAL_EVENT, onDial);
      window.removeEventListener(CIRCUIT_EVENT, onCircuit);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      // most other pages aren't dressed for goth yet, so leaving the
      // homepage turns the lights back on. the ones that are call
      // useAmbience() and switch them right back
      clearAmbience();
    };
  }, []);

  return (
    <div
      className={styles.pot}
      title={
        circuitOn
          ? "breadboard pot: set the ambience"
          : "turn the circuit on to use the breadboard pot"
      }
    >
      <span
        className={`${styles.reading} ${showLabel ? styles.visible : ""}`}
        aria-live="polite"
      >
        {label}
      </span>
      {/* follows the breadboard pot, and can be dragged too. both only
          count while the circuit is on */}
      <input
        className={styles.slider}
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(value * 100)}
        onChange={(e) => dialAmbience((Number(e.target.value) / 100) * 1023)}
        aria-label={`ambience, currently ${label}`}
        style={{ opacity: circuitOn ? 1 : 0.4 }}
      />
      <span className={styles.tag} aria-hidden="true">
        {circuitOn ? "ambience" : "circuit off"}
      </span>

      {/* dusk overlay, driven by --dusk on :root */}
      <div className={styles.dusk} aria-hidden="true" />
    </div>
  );
}
