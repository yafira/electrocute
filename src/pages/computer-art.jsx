import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import computerArt from "../data/computerArt";
import styles from "../styles/ComputerArt.module.css";

const TAGLINE =
  "generative sketches from electrocute lab — mostly p5.js, some sent to a plotter.";

function resolveEmbedUrl(piece) {
  return (
    piece.embedPath ||
    `https://editor.p5js.org/electrocute/full/${piece.sketchId}`
  );
}

// one grid tile. self-hosted live sketches lazy-load an actual iframe
// preview once scrolled into view — the canvas-scaling fix in each
// sketch's own index.html means this can finally render at a real
// size instead of cropping. pieces not yet converted (still only a
// p5-editor sketchId) show a plain placeholder instead of embedding
// the editor's toolbar chrome inline. static/plotter pieces show
// their photo. click any tile for the fullscreen viewer.
function Tile({ piece, onExpand }) {
  const frameRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const isSelfHosted = piece.kind === "live" && Boolean(piece.embedPath);

  useEffect(() => {
    if (!isSelfHosted) return undefined;
    const el = frameRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isSelfHosted]);

  return (
    <div className={styles.tile} id={`piece-${piece.slug}`}>
      <div className={styles.tileHead}>
        <span className={styles.index}>{piece.index}</span>
        <span className={styles.tags}>{piece.tags.join(" / ")}</span>
      </div>

      <button
        type="button"
        className={styles.frame}
        ref={frameRef}
        onClick={() => onExpand(piece)}
        aria-label={`open ${piece.title}`}
      >
        {piece.kind === "static" ? (
          <img
            className={styles.media}
            src={piece.images[0]}
            alt=""
            loading="lazy"
          />
        ) : isSelfHosted ? (
          loaded ? (
            <iframe
              className={styles.media}
              src={piece.embedPath}
              title={piece.title}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <span className={styles.loadingTile} aria-hidden="true" />
          )
        ) : (
          <span className={styles.livePlaceholder}>
            <span className={styles.livePlaceholderLabel}>
              view sketch {"\u2197"}
            </span>
          </span>
        )}
      </button>

      <div className={styles.tileFoot}>
        <span className={styles.title}>{piece.title}</span>
        <span className={styles.expand} aria-hidden="true">
          {"\u2197"}
        </span>
      </div>
    </div>
  );
}

// sticky sidebar — a plain directory of every piece by name. clicking
// one opens it directly in the fullscreen viewer.
function Directory({ onExpand }) {
  return (
    <nav className={styles.directory} aria-label="piece directory">
      <div className={styles.directoryHead}>index</div>
      <ul className={styles.directoryList}>
        {computerArt.map((piece) => (
          <li key={piece.slug}>
            <button
              type="button"
              className={styles.directoryItem}
              onClick={() => onExpand(piece)}
            >
              <span className={styles.directoryIndex}>{piece.index}</span>
              <span className={styles.directoryTitle}>{piece.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// fullscreen viewer — dark backdrop, the piece large and centered, a
// close button, nothing else. no title bar, no drag handle, no url
// bar; a takeover view rather than a floating window.
function Lightbox({ piece, onClose }) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isStatic = piece.kind === "static";

  return (
    <div
      className={styles.lightboxBackdrop}
      onClick={onClose}
      role="dialog"
      aria-label={piece.title}
    >
      <button
        type="button"
        className={styles.lightboxClose}
        onClick={onClose}
        aria-label="close and return to computer art"
      >
        <span aria-hidden="true">{"\u2715"}</span>
        <span>close</span>
      </button>

      <div
        className={
          isStatic ? styles.lightboxImageBox : styles.lightboxSketchBox
        }
        onClick={(e) => e.stopPropagation()}
      >
        {isStatic ? (
          <img
            className={styles.lightboxImage}
            src={piece.images[activeImage]}
            alt={`${piece.title}, variant ${activeImage + 1}`}
          />
        ) : (
          <iframe
            className={styles.lightboxIframe}
            src={resolveEmbedUrl(piece)}
            title={piece.title}
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>

      {isStatic && piece.images.length > 1 && (
        <div className={styles.thumbs} onClick={(e) => e.stopPropagation()}>
          {piece.images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`${styles.thumb} ${
                i === activeImage ? styles.thumbActive : ""
              }`}
              onClick={() => setActiveImage(i)}
              aria-label={`show variant ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}

      <div className={styles.lightboxCaption}>
        <span>{piece.title}</span>
        <span className={styles.lightboxTags}>{piece.tags.join(" / ")}</span>
      </div>
    </div>
  );
}

export default function ComputerArt() {
  const [activePiece, setActivePiece] = useState(null);

  // opening the viewer pushes a history entry (or replaces it, if
  // switching straight from one piece to another) so the browser's
  // back button closes the viewer instead of navigating away from the
  // page entirely. closing it — via the X, backdrop, or Escape — pops
  // that entry back off so history stays clean either way.
  const openPiece = (piece) => {
    if (typeof window !== "undefined") {
      const method = activePiece ? "replaceState" : "pushState";
      window.history[method]({ lightbox: true }, "", `#${piece.slug}`);
    }
    setActivePiece(piece);
  };

  const closePiece = () => {
    setActivePiece(null);
    if (typeof window !== "undefined" && window.location.hash) {
      window.history.back();
    }
  };

  useEffect(() => {
    const onPopState = () => setActivePiece(null);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <>
      <Head>
        <title>computer art</title>
        <meta
          name="description"
          content="generative sketches and plotter prints from electrocute lab"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.header}>
          <a className={styles.eyebrow} href="https://electrocute.io">
            {"\u2190"} electrocute.io
          </a>
          <h1 className={styles.title1}>computer art</h1>
          <p className={styles.tagline}>{TAGLINE}</p>
        </header>

        <div className={styles.layout}>
          <Directory onExpand={openPiece} />

          <section className={styles.grid} aria-label="generative art grid">
            {computerArt.map((piece) => (
              <Tile key={piece.slug} piece={piece} onExpand={openPiece} />
            ))}
          </section>
        </div>

        <footer className={styles.footer}>
          <a href="https://electrocute.io">electrocute lab</a>
        </footer>
      </main>

      {activePiece && <Lightbox piece={activePiece} onClose={closePiece} />}
    </>
  );
}
