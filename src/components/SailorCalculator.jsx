// the sailor moon calculator, rebuilt from github.com/yafira/sailor-moon-calculator
// so it can pop up on its own over the page, no window around it.
// same buttons and math as the original, just shrunk to fit a screen.

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/SailorCalculator.module.css";

const KEYS = [
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "−"],
  [".", "0", "=", "+"],
];
const OPERATORS = ["÷", "×", "−", "+"];

// keyboard keys that map onto calculator buttons
const KEYBOARD = {
  "/": "÷",
  "*": "×",
  x: "×",
  "-": "−",
  "+": "+",
  "=": "=",
  Enter: "=",
  ".": ".",
};

function operate(op, a, b) {
  a = Number(a);
  b = Number(b);
  if (op === "+") return a + b;
  if (op === "−") return a - b;
  if (op === "×") return a * b;
  if (op === "÷") return b === 0 ? null : a / b;
  return null;
}

const round = (n) => Math.round(n * 1000) / 1000;

export default function SailorCalculator({ onClose }) {
  const [current, setCurrent] = useState("0");
  const [last, setLast] = useState("");
  const [first, setFirst] = useState("");
  const [op, setOp] = useState(null);
  const [reset, setReset] = useState(false);
  const closeRef = useRef(null);

  const clear = () => {
    setCurrent("0");
    setLast("");
    setFirst("");
    setOp(null);
    setReset(false);
  };

  const del = () => setCurrent((c) => c.slice(0, -1));

  const appendNum = (n) => {
    if (current === "0" || reset) {
      setCurrent(n);
      setReset(false);
    } else {
      setCurrent(current + n);
    }
  };

  const appendDecimal = () => {
    if (reset) {
      setCurrent("0.");
      setReset(false);
      return;
    }
    if (current.includes(".")) return;
    setCurrent(current === "" ? "." : current + ".");
  };

  // returns the value now on screen, so chained operations use it
  const evaluate = () => {
    if (op === null || reset) return current;
    if (op === "÷" && current === "0") {
      // the original used an alert here; this keeps it on the screen
      setLast("you can't divide by 0");
      return current;
    }
    const result = String(round(operate(op, first, current)));
    setLast(`${first} ${op} ${current} =`);
    setCurrent(result);
    setOp(null);
    // typing after an answer starts a new number instead of adding on
    setReset(true);
    return result;
  };

  const setOperation = (next) => {
    const value = op !== null ? evaluate() : current;
    setFirst(value);
    setOp(next);
    setLast(`${value} ${next}`);
    setReset(true);
  };

  const press = (key) => {
    if (OPERATORS.includes(key)) setOperation(key);
    else if (key === "=") evaluate();
    else if (key === ".") appendDecimal();
    else appendNum(key);
  };

  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "Backspace") return del();
      if (e.key === "Delete" || e.key.toLowerCase() === "c") return clear();
      const key = /^[0-9]$/.test(e.key) ? e.key : KEYBOARD[e.key];
      if (!key) return;
      e.preventDefault();
      press(key);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, first, op, reset, onClose],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.calculator}
        role="dialog"
        aria-modal="true"
        aria-label="sailor moon calculator"
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="close the calculator"
        >
          ×
        </button>

        <div className={styles.luna}>
          <img src="/assets/luna.png" alt="" />
        </div>

        <div className={styles.screen} aria-live="polite">
          <div className={styles.screenLast}>{last}</div>
          <div className={styles.screenCurrent}>{current || " "}</div>
        </div>

        <div className={styles.grid}>
          <button
            type="button"
            className={`${styles.btn} ${styles.pill} ${styles.pink}`}
            onClick={clear}
          >
            clear
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.pill} ${styles.purple}`}
            onClick={del}
          >
            delete
          </button>
          {KEYS.flat().map((k) => {
            const button = (
              <button
                key={k}
                type="button"
                className={styles.btn}
                onClick={() => press(k)}
                aria-label={
                  { "÷": "divide", "×": "times", "−": "minus" }[k] || undefined
                }
              >
                {k}
              </button>
            );
            // the two stars ride in the ÷ and × cells, like the original
            if (k !== "÷" && k !== "×") return button;
            return (
              <div key={k} className={styles.starCell}>
                {button}
                <svg
                  className={styles.star}
                  viewBox="0 0 40 38"
                  aria-hidden="true"
                >
                  <polygon points="20,1 25,14 39,14 28,23 32,37 20,29 8,37 12,23 1,14 15,14" />
                </svg>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
