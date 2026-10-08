import styles from "../styles/Header.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { onPower } from "../lib/powerSurge";

// how long the current takes to run up the cable before the logo reacts
const CABLE_TRAVEL_MS = 380;

export default function Header() {
  const [petals, setPetals] = useState([]);
  // "on" while powered, plus a one-shot flicker as the power changes
  const [powered, setPowered] = useState(false);
  const [flicker, setFlicker] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    const off = onPower((on) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setFlicker(null);
      later(() => {
        setPowered(on);
        setFlicker(on ? "up" : "down");
      }, CABLE_TRAVEL_MS);
      later(() => setFlicker(null), CABLE_TRAVEL_MS + 1400);
    });

    return () => {
      off();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const rain = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 1.5,
      size: 14 + Math.random() * 14,
      spin: Math.random() > 0.5 ? 1 : -1,
    }));
    setPetals(burst);
    setTimeout(() => setPetals([]), 4200);
  };

  return (
    <div className={styles.Header}>
      <Link href="/">
        <h1
          className={[
            styles.logo,
            powered ? styles.powered : "",
            flicker === "up" ? styles.flickerUp : "",
            flicker === "down" ? styles.flickerDown : "",
          ].join(" ")}
        >
          <span>electrocute</span>
          <img
            src="/flower.png"
            alt=""
            className={styles.flower}
            onClick={rain}
          />
          <span className={styles.labWord}>
            lab
            {/* the little port the breadboard's power cable plugs into */}
            <span
              className={styles.socket}
              data-power-socket=""
              aria-hidden="true"
            />
          </span>
        </h1>
      </Link>

      {petals.map((p) => (
        <img
          key={p.id}
          src="/flower.png"
          alt=""
          aria-hidden="true"
          className={styles.petal}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--spin": p.spin,
          }}
        />
      ))}
    </div>
  );
}
