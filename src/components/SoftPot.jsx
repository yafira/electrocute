// a soft potentiometer for the whole site: slide it and the page
// washes through the lab palette (paper, blush, butter, matcha,
// wisteria) and finally dims into evening. remembered per device.

import { useEffect, useRef, useState } from "react";
import styles from "../styles/SoftPot.module.css";

const LOCAL_KEY = "electrocute:softpot";

// palette stops along the slider, 0 -> 1
const STOPS = [
  { at: 0.0, color: "#fbfcf5", label: "paper" },
  { at: 0.22, color: "#fff3f8", label: "blush" },
  { at: 0.44, color: "#fffee9", label: "butter" },
  { at: 0.66, color: "#f3faea", label: "matcha" },
  { at: 0.88, color: "#f4f0ff", label: "wisteria" },
  { at: 1.0, color: "#efe9ff", label: "evening" },
];

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
  const { color } = sample(v);
  document.body.style.transition = "background-color 0.4s ease";
  document.body.style.backgroundColor = color;
  // the last stretch of the dial pulls dusk over everything
  const dusk = Math.max(0, (v - 0.88) / 0.12);
  document.documentElement.style.setProperty("--dusk", dusk.toFixed(3));
}

export default function SoftPot() {
  const [value, setValue] = useState(0);
  const [label, setLabel] = useState("paper");
  const [showLabel, setShowLabel] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    const saved = parseFloat(localStorage.getItem(LOCAL_KEY));
    const v = Number.isFinite(saved) ? saved : 0;
    setValue(v);
    setLabel(sample(v).label);
    applyAmbience(v);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const onChange = (event) => {
    const v = Number(event.target.value) / 100;
    setValue(v);
    setLabel(sample(v).label);
    setShowLabel(true);
    applyAmbience(v);
    localStorage.setItem(LOCAL_KEY, String(v));
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowLabel(false), 1200);
  };

  return (
    <div className={styles.pot} title="soft potentiometer: set the ambience">
      <span
        className={`${styles.reading} ${showLabel ? styles.visible : ""}`}
        aria-hidden="true"
      >
        {label}
      </span>
      <input
        className={styles.slider}
        type="range"
        min="0"
        max="100"
        step="1"
        value={Math.round(value * 100)}
        onChange={onChange}
        aria-label={`ambience, currently ${label}`}
      />
      <span className={styles.tag} aria-hidden="true">
        ambience
      </span>

      {/* dusk overlay, driven by --dusk on :root */}
      <div className={styles.dusk} aria-hidden="true" />
    </div>
  );
}
