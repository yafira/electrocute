// a felt button for the web: squishes like felt, hums a soft tone,
// and remembers every press across all visitors (via /api/press).
// when no backend is configured it keeps a per-device count instead.

import { useEffect, useRef, useState } from "react";
import styles from "../styles/FeltButton.module.css";
import { playFeltTone } from "@/lib/feltTone";

const LOCAL_KEY = "electrocute:felt-presses";

export default function FeltButton() {
  const [count, setCount] = useState(null);
  const [shared, setShared] = useState(false);
  const [pressing, setPressing] = useState(false);
  const pending = useRef(0);
  const flushTimer = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/press")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data.shared && typeof data.count === "number") {
          setShared(true);
          setCount(data.count);
        } else {
          setCount(Number(localStorage.getItem(LOCAL_KEY)) || 0);
        }
      })
      .catch(() => {
        if (alive) setCount(Number(localStorage.getItem(LOCAL_KEY)) || 0);
      });
    return () => {
      alive = false;
      if (flushTimer.current) clearTimeout(flushTimer.current);
    };
  }, []);

  // mashing the button feels good, so presses update instantly on
  // screen and sync to the server in a small debounced batch.
  const flush = () => {
    const batch = pending.current;
    pending.current = 0;
    for (let i = 0; i < batch; i++) {
      fetch("/api/press", { method: "POST" }).catch(() => {});
    }
  };

  const press = () => {
    playFeltTone();
    setPressing(true);
    setTimeout(() => setPressing(false), 140);

    setCount((current) => {
      const next = (current || 0) + 1;
      if (!shared) localStorage.setItem(LOCAL_KEY, String(next));
      return next;
    });

    if (shared) {
      pending.current += 1;
      if (flushTimer.current) clearTimeout(flushTimer.current);
      flushTimer.current = setTimeout(flush, 400);
    }
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.felt} ${pressing ? styles.pressed : ""}`}
        onClick={press}
        aria-label="press the felt button"
      >
        <span className={styles.stitchRing} aria-hidden="true" />
        <span className={styles.center} aria-hidden="true" />
      </button>
      <p className={styles.caption}>
        {count === null ? (
          <>a felt button, because every site deserves one</>
        ) : (
          <>
            pressed{" "}
            <span className={styles.count}>{count.toLocaleString()}</span>{" "}
            {count === 1 ? "time" : "times"}
            {shared ? " by visitors" : " on this device"} ✿
          </>
        )}
      </p>
    </div>
  );
}
