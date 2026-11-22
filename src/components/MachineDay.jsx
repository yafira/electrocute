import { useEffect, useState } from "react";
import styles from "../styles/Footer.module.css";

// the ascii control characters 1 to 31. every month and day lands on one.
const control = [
  "null",
  "start of heading",
  "start of text",
  "end of text",
  "end of transmission",
  "enquiry",
  "acknowledge",
  "bell",
  "backspace",
  "horizontal tab",
  "line feed",
  "vertical tab",
  "form feed",
  "carriage return",
  "shift out",
  "shift in",
  "data link escape",
  "device control one",
  "device control two",
  "device control three",
  "device control four",
  "negative acknowledge",
  "synchronous idle",
  "end of transmission block",
  "cancel",
  "end of medium",
  "substitute",
  "escape",
  "file separator",
  "group separator",
  "record separator",
  "unit separator",
];

// today the way the machine reads it, like 1011 / 10110 · vertical tab, synchronous idle
export default function MachineDay() {
  const [day, setDay] = useState(null);

  // worked out in the browser so it's always today, nyc time
  useEffect(() => {
    const [m, d] = new Date()
      .toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        month: "numeric",
        day: "numeric",
      })
      .split("/")
      .map(Number);
    setDay({ m, d });
  }, []);

  if (!day) return <p className={styles.machineDay} aria-hidden="true">&nbsp;</p>;

  return (
    <p
      className={styles.machineDay}
      title="today's date in binary, and what those numbers mean in ascii"
    >
      <span className={styles.machineWords}>
        today · {day.m.toString(2)} / {day.d.toString(2)} ·
      </span>{" "}
      <span className={styles.machineWords}>
        {control[day.m]}, {control[day.d]}
      </span>
    </p>
  );
}
