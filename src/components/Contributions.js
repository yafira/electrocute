// "featured in" — kept small and out of the way, right above the
// footer, instead of a big standalone section. the flipbook is a
// small clickable preview rather than a full embed; clicking it
// opens the real thing at full size in the site's usual floating
// window (same IframePanel every project card uses).

import { useState } from "react";
import IframePanel from "./IframePanel";
import styles from "../styles/Contributions.module.css";

export default function Contributions() {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.contributions}>
      <span className={styles.label}>featured in</span>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.item}
          onClick={() => setOpen(true)}
          title="hello blob: agar as interface"
        >
          <span className={styles.thumb}>
            <iframe
              tabIndex={-1}
              scrolling="no"
              src="https://heyzine.com/flip-book/a1c7dca16d.html"
              title="hello blob: agar as interface (preview)"
            />
          </span>
          <span className={styles.caption}>hello blob: agar as interface</span>
        </button>

        <a
          className={styles.item}
          href="https://internetphonebook.net"
          target="_blank"
          rel="noopener noreferrer"
          title="dial-a-site: #17"
        >
          <span className={styles.thumb}>
            <img
              src="https://internetphonebook.net/images/badges/hand-with-flower-border-radius.png"
              alt="this website is in the internet phone book"
            />
          </span>
          <span className={styles.caption}>dial-a-site: #17</span>
        </a>
      </div>

      {open && (
        <IframePanel
          url="https://heyzine.com/flip-book/a1c7dca16d.html"
          title="hello blob: agar as interface"
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}
