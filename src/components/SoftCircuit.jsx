// a tiny sewable circuit under the nav: coin cell, switch, and a
// sewable LED module joined by conductive thread (running stitch,
// naturally). close the switch and the stitches become the current:
// the dashes flow around the loop and the LED glows. the site
// remembers if you left the light on.

import { useEffect, useState } from "react";
import { playFeltTone } from "@/lib/feltTone";
import styles from "../styles/SoftCircuit.module.css";

const LOCAL_KEY = "electrocute:circuit";

export default function SoftCircuit() {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOn(localStorage.getItem(LOCAL_KEY) === "on");
    setReady(true);
  }, []);

  const toggle = () => {
    setOn((current) => {
      const next = !current;
      localStorage.setItem(LOCAL_KEY, next ? "on" : "off");
      playFeltTone(next ? 640 : 320);
      return next;
    });
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  return (
    <div className={styles.holder}>
      <svg
        className={styles.circuit}
        viewBox="0 0 380 104"
        role="img"
        aria-label="a sewable circuit: coin cell, switch, and LED joined by conductive thread"
      >
        <defs>
          <radialGradient id="ledGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cdbdf0" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#cdbdf0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#cdbdf0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── conductive thread (running stitch = the current) ── */}
        <path
          className={`${styles.thread} ${on ? styles.flowing : ""}`}
          d="M 68 44 C 105 32, 140 34, 166 38"
        />
        <path
          className={`${styles.thread} ${on ? styles.flowing : ""}`}
          d="M 214 38 C 245 34, 285 38, 306 46"
        />
        <path
          className={`${styles.thread} ${on ? styles.flowing : ""}`}
          d="M 322 66 C 290 92, 105 92, 62 64"
        />

        {/* ── coin cell module ── */}
        <g>
          <circle cx="48" cy="52" r="19" fill="#efece6" stroke="#c3b9b9" strokeWidth="2" />
          <circle cx="48" cy="52" r="12.5" fill="#e5e2dc" stroke="#d5d0c6" strokeWidth="1" />
          <text x="48" y="56" textAnchor="middle" className={styles.moduleLabel}>
            3v
          </text>
          {/* sew holes */}
          <circle cx="65" cy="46" r="2.6" fill="#fbfcf5" stroke="#c3b9b9" strokeWidth="1.4" />
          <circle cx="61" cy="63" r="2.6" fill="#fbfcf5" stroke="#c3b9b9" strokeWidth="1.4" />
        </g>

        {/* ── switch module (click me) ── */}
        <g
          className={styles.switchModule}
          role="switch"
          aria-checked={on}
          aria-label={on ? "switch closed, LED on. open the switch" : "switch open. close the switch to light the LED"}
          tabIndex={0}
          onClick={toggle}
          onKeyDown={onKeyDown}
        >
          {/* generous invisible tap target */}
          <rect x="152" y="10" width="76" height="56" fill="transparent" />
          <rect
            x="160"
            y="26"
            width="60"
            height="24"
            rx="12"
            fill="#fffee9"
            stroke="#f1dbcc"
            strokeWidth="2"
          />
          {/* sew holes */}
          <circle cx="167" cy="38" r="2.6" fill="#fbfcf5" stroke="#e7c29d" strokeWidth="1.4" />
          <circle cx="213" cy="38" r="2.6" fill="#fbfcf5" stroke="#e7c29d" strokeWidth="1.4" />
          {/* pivot, contact, lever */}
          <circle cx="177" cy="38" r="3.2" fill="#a99f83" />
          <circle cx="203" cy="38" r="3.2" fill="#a99f83" />
          <g
            className={`${styles.lever} ${on ? styles.closed : ""} ${
              ready && !on ? styles.inviting : ""
            }`}
          >
            <line
              x1="177"
              y1="38"
              x2="203"
              y2="38"
              stroke="#8b8271"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="203" cy="38" r="4.2" fill="#e7c29d" stroke="#d9ab7f" strokeWidth="1.5" />
          </g>
        </g>

        {/* ── sewable LED module ── */}
        <g>
          {on && <circle cx="320" cy="52" r="26" fill="url(#ledGlow)" className={styles.glow} />}
          <circle cx="320" cy="52" r="15" fill="#f4f0ff" stroke="#d5c8fa" strokeWidth="2" />
          <circle
            cx="320"
            cy="52"
            r="6.5"
            className={on ? styles.ledOn : styles.ledOff}
          />
          {/* sew holes marked + and − */}
          <circle cx="306" cy="45" r="2.6" fill="#fbfcf5" stroke="#d5c8fa" strokeWidth="1.4" />
          <circle cx="322" cy="68" r="2.6" fill="#fbfcf5" stroke="#d5c8fa" strokeWidth="1.4" />
          <text x="299" y="41" className={styles.polarity}>+</text>
          <text x="329" y="72" className={styles.polarity}>−</text>
        </g>
      </svg>
    </div>
  );
}
