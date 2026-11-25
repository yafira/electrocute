// a tiny sewable circuit that the nav lives inside of: 9v battery,
// then the about/blog/contact/shop pills (sewn onto the board same as
// any other component), then a switch, a sewable LED, and a small
// continuity tester made of five cross-stitches. close the switch
// and the thread flows, the LED lights, and the stitches test the
// connection one at a time — like touching a probe along a real
// conductive-thread trace, confirming the circuit all the way
// through.
//
// the on/off state lives one level up (see index.js) so the page
// can react to it too — closing this switch also pulses a brief
// "stitch" flash across the site's other dashed borders.

import { useEffect } from "react";
import Link from "next/link";
import headerStyles from "../styles/Header.module.css";
import styles from "../styles/SoftCircuit.module.css";
import { startCircuitBuzz, stopCircuitBuzz } from "../lib/circuitBuzz";

function NineVoltCell() {
  return (
    <svg className={styles.cellSvg} viewBox="0 0 48 48" aria-hidden="true">
      <rect
        x="6"
        y="13"
        width="36"
        height="22"
        rx="3"
        fill="#efece6"
        stroke="#c3b9b9"
        strokeWidth="2"
      />
      <circle cx="16" cy="11" r="2.2" fill="#e5e2dc" stroke="#c3b9b9" strokeWidth="1.2" />
      <circle cx="32" cy="11" r="2.2" fill="#e5e2dc" stroke="#c3b9b9" strokeWidth="1.2" />
      <text x="24" y="28" textAnchor="middle" className={styles.moduleLabel}>
        9v
      </text>
      <circle cx="44" cy="25" data-thread="ninev-pos" r="2.2" fill="#fbfcf5" stroke="#c3b9b9" strokeWidth="1.2" />
      <circle cx="44" cy="33" data-thread="ninev-neg" r="2.2" fill="#fbfcf5" stroke="#c3b9b9" strokeWidth="1.2" />
    </svg>
  );
}

function Switch({ on, ready, onToggle, onKeyDown }) {
  return (
    <svg
      className={styles.switchSvg}
      viewBox="0 0 76 48"
      role="switch"
      aria-checked={on}
      aria-label={
        on
          ? "switch closed, LED on. open the switch"
          : "switch open. close the switch to light the LED"
      }
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={onKeyDown}
    >
      <rect x="0" y="10" width="76" height="28" fill="transparent" />
      <rect
        x="8"
        y="12"
        width="60"
        height="24"
        rx="12"
        fill="#fffee9"
        stroke="#f1dbcc"
        strokeWidth="2"
      />
      <circle
        cx="15"
        cy="24"
        r="2.6"
        fill="#fbfcf5"
        stroke="#e7c29d"
        strokeWidth="1.4"
      />
      <circle
        cx="61"
        cy="24"
        r="2.6"
        fill="#fbfcf5"
        stroke="#e7c29d"
        strokeWidth="1.4"
      />
      <circle cx="25" cy="24" r="3.2" fill="#a99f83" />
      <circle cx="51" cy="24" r="3.2" fill="#a99f83" />
      <g
        className={`${styles.lever} ${on ? styles.closed : ""} ${
          ready && !on ? styles.inviting : ""
        }`}
      >
        <line
          x1="25"
          y1="24"
          x2="51"
          y2="24"
          stroke="#8b8271"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle
          cx="51"
          cy="24"
          r="4.2"
          fill="#e7c29d"
          stroke="#d9ab7f"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

function Led({ on }) {
  return (
    <svg className={styles.ledSvg} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="ledGlowCompact" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#cdbdf0" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#cdbdf0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#cdbdf0" stopOpacity="0" />
        </radialGradient>
      </defs>
      {on && (
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="url(#ledGlowCompact)"
          className={styles.glow}
        />
      )}
      <circle
        cx="24"
        cy="24"
        r="15"
        fill="#f4f0ff"
        stroke="#d5c8fa"
        strokeWidth="2"
      />
      <circle
        cx="24"
        cy="24"
        r="6.5"
        className={on ? styles.ledOn : styles.ledOff}
      />
      <circle
        cx="10"
        cy="17"
        r="2.6"
        fill="#fbfcf5"
        stroke="#d5c8fa"
        strokeWidth="1.4"
      />
      <circle
        cx="26"
        cy="40"
        data-thread="led-out"
        r="2.6"
        fill="#fbfcf5"
        stroke="#d5c8fa"
        strokeWidth="1.4"
      />
      <text x="3" y="13" className={styles.polarity}>
        +
      </text>
      <text x="33" y="44" className={styles.polarity}>
        −
      </text>
    </svg>
  );
}

export default function SoftCircuit({ on, ready, onToggle }) {
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  useEffect(() => {
    if (!ready) return;
    if (on) {
      startCircuitBuzz();
    } else {
      stopCircuitBuzz();
    }
    return () => stopCircuitBuzz();
  }, [on, ready]);

  return (
    <div className={styles.board}>
      <Switch on={on} ready={ready} onToggle={onToggle} onKeyDown={onKeyDown} />
      <span className={`${styles.thread} ${on ? styles.flowing : ""}`} />

      <nav className={`${headerStyles.nav} ${styles.sewnNav}`}>
        <Link href="/about">about</Link>
        <a href="https://blog.electrocute.io/">blog</a>
        <Link href="/contact">contact</Link>
        <Link href="/craftcomputery">shop</Link>
      </nav>

      <span className={`${styles.thread} ${on ? styles.flowing : ""}`} />
      <NineVoltCell />
      <span className={`${styles.thread} ${on ? styles.flowing : ""}`} />
      <Led on={on} />
      <span className={`${styles.thread} ${on ? styles.flowing : ""}`} />
    </div>
  );
}
