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
          <span className={styles.source}>growing bio hci</span>
          <span className={styles.caption}>
            <span>hello blob:</span> <span>agar as interface</span>
          </span>
        </button>

        <a
          className={styles.item}
          href="https://internetphonebook.net"
          target="_blank"
          rel="noopener noreferrer"
          title="dial-a-site: #17"
        >
          <span className={`${styles.thumb} ${styles.badge}`}>
            <img
              src="https://internetphonebook.net/images/badges/hand-with-flower-border-radius.png"
              alt="this website is in the internet phone book"
            />
          </span>
          <span className={styles.source}>internet phone book</span>
          <span className={styles.caption}>dial-a-site: #17</span>
        </a>

        <a
          className={styles.item}
          href="https://smallbatchdata.market/archive/slow-harvest"
          target="_blank"
          rel="noopener noreferrer"
          title="small batch: slow harvest"
        >
          <span className={styles.thumb}>
            <img
              className={styles.top}
              src="https://smallbatchdata.market/images/archive/slow-harvest-1.jpg"
              alt="slow harvest stall poster for the small batch dataset farmers market"
            />
          </span>
          <span className={styles.source}>
            <span>small batch:</span> <span>a dataset</span>{" "}
            <span>farmers market</span>
          </span>
          <span className={styles.caption}>slow harvest</span>
        </a>

        <a
          className={styles.item}
          href="https://www.arte.tv/fr/videos/126484-033-A/tracks/"
          target="_blank"
          rel="noopener noreferrer"
          title="cyberdecks: les ordis faits maison sans IA et sans tech bros | tracks | arte"
        >
          <span className={styles.thumb}>
            <img
              src="/assets/featured/arte-tracks-v2.webp"
              alt="the soft computer's e-ink screen reading care, in the arte tracks cyberdecks episode"
            />
          </span>
          <span className={styles.source}>arte tracks</span>
          <span className={styles.caption} lang="fr">
            <span>cyberdecks:</span> <span>les ordis faits</span>{" "}
            <span>maison sans IA</span> <span>et sans tech bros</span>
          </span>
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
