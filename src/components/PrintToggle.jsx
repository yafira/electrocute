import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { toggle, remove } from "fluoro-riso";
import styles from "../styles/Header.module.css";

// the two inks the page prints in; swap for any fluoro preset or hex pair
const INKS = { inkA: "#ff48b0", inkB: "#0078bf" };

// riso-prints the page with fluoro. leaving the page restores it,
// so every page loads unprinted and scrolls at full speed until clicked.
export default function PrintToggle() {
  const [printed, setPrinted] = useState(false);

  useEffect(() => () => remove(INKS), []);

  return (
    <div className={styles.print}>
      <button
        type="button"
        className={styles.printButton}
        onClick={() => setPrinted(toggle(INKS))}
        aria-pressed={printed}
      >
        <FontAwesomeIcon icon={faPrint} aria-hidden="true" />
        <span>{printed ? "unprint" : "riso print"}</span>
      </button>
      {printed && (
        <a
          className={styles.printNote}
          href="https://www.npmjs.com/package/fluoro-riso"
          target="_blank"
          rel="noopener noreferrer"
        >
          printed with fluoro-riso ↗
        </a>
      )}
    </div>
  );
}
