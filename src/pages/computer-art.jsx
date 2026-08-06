import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import computerArt from "../data/computerArt";
import styles from "../styles/ComputerArt.module.css";

const TAGLINE = "tiny algorithms doodling on their own.";

const featuredPiece = computerArt.find(
  (p) => p.slug === "self-portrait-kawaii",
);
const gridPieces = computerArt.filter((p) => p.slug !== "self-portrait-kawaii");

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
// their photo. click any tile for the fullscreen viewer — except
// pieces flagged `interactive`, which stay live and clickable right in
// the grid instead (the sketch itself handles the click), since
// forcing those into a one-off fullscreen view would just get in the
// way of playing with them.
function Tile({ piece, onExpand }) {
  const frameRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isSelfHosted = piece.kind === "live" && Boolean(piece.embedPath);
  const isInteractive = Boolean(piece.interactive);

  useEffect(() => {
    if (!isSelfHosted) return undefined;
    const el = frameRef.current;
    if (!el) return undefined;

    // bidirectional: mount the iframe when scrolled into view, but also
    // unmount it again when scrolled back out. without this, every
    // sketch you've ever scrolled past stays mounted and keeps
    // animating in the background — with 30+ pieces that adds up fast
    // and the page grinds to a crawl the further down you go.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setLoaded(entry.isIntersecting);
          if (!entry.isIntersecting) setIsActive(false);
        });
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isSelfHosted]);

  const media =
    piece.kind === "static" ? (
      <img
        className={styles.media}
        src={piece.images[0]}
        alt=""
        loading="lazy"
      />
    ) : isSelfHosted ? (
      loaded ? (
        <div
          className={`${styles.interactiveContainer} ${isInteractive && isActive ? styles.interactiveActive : ""}`}
        >
          <iframe
            className={isInteractive ? styles.mediaInteractive : styles.media}
            src={piece.embedPath}
            title={piece.title}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
          {isInteractive && (
            <button
              type="button"
              className={styles.touchShield}
              onClick={() => setIsActive(true)}
              aria-label={`interact with ${piece.title}`}
            >
              <span className={styles.touchShieldLabel}>
                {isActive ? "" : "tap to play ✨"}
              </span>
            </button>
          )}
        </div>
      ) : (
        <span className={styles.loadingTile} aria-hidden="true" />
      )
    ) : (
      <span className={styles.livePlaceholder}>
        <span className={styles.livePlaceholderLabel}>
          view sketch {"\u2197"}
        </span>
      </span>
    );

  return (
    <div className={styles.tile} id={`piece-${piece.slug}`}>
      <div className={styles.tileHead}>
        <span className={styles.index}>{piece.index}</span>
        <span className={styles.tags}>{piece.tags.join(" / ")}</span>
      </div>

      {isInteractive ? (
        <div className={styles.frame} ref={frameRef}>
          {media}
        </div>
      ) : (
        <button
          type="button"
          className={styles.frame}
          ref={frameRef}
          onClick={() => onExpand(piece)}
          aria-label={`open ${piece.title}`}
        >
          {media}
        </button>
      )}

      <div className={styles.tileFoot}>
        <span className={styles.title}>{piece.title}</span>
        <span className={styles.expand} aria-hidden="true">
          {isInteractive ? "click to change \u2728" : "\u2197"}
        </span>
      </div>
    </div>
  );
}

// featured widget above the directory — just the self-portrait, live
// and clickable, no lazy-load delay since it's always the first thing
// on the page. a small personal touch before the numbered collection
// starts.
function FeaturedPortrait({ piece }) {
  if (!piece) return null;

  return (
    <div className={styles.featured} id={`piece-${piece.slug}`}>
      <div className={styles.featuredFrame}>
        <iframe
          className={styles.mediaInteractive}
          src={piece.embedPath}
          title={piece.title}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <p className={styles.featuredCaption}>
        hi, i&apos;m{" "}
        <a
          href="https://yafira.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          yafira
        </a>{" "}
        aka electrocute! ✿<br></br>
        click to switch my expression. ☻
      </p>
    </div>
  );
}

// sticky sidebar — a plain directory of every piece by name. clicking
// one opens it directly in the fullscreen viewer — except interactive
// pieces, which instead scroll the grid to that tile, since they don't
// have a fullscreen view to open.
function Directory({ onExpand }) {
  const handleClick = (piece) => {
    if (piece.interactive) {
      document
        .getElementById(`piece-${piece.slug}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onExpand(piece);
  };

  return (
    <nav className={styles.directory} aria-label="piece directory">
      <div className={styles.directoryHead}>index</div>
      <ul className={styles.directoryList}>
        {gridPieces.map((piece) => (
          <li key={piece.slug}>
            <button
              type="button"
              className={styles.directoryItem}
              onClick={() => handleClick(piece)}
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
        className={styles.winCloseBtn}
        onClick={onClose}
        aria-label="close and return to computer art"
      >
        <span className={styles.winCloseX} aria-hidden="true">
          {"\u00D7"}
        </span>
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

  const openPiece = (piece) => {
    if (typeof window !== "undefined") {
      const method = activePiece ? "replaceState" : "pushState";
      window.history[method]({ lightbox: true }, "", `#${piece.slug}`);
    }
    setActivePiece(piece);
  };

  const closePiece = () => {
    setActivePiece(null);
    if (typeof window !== "undefined") {
      // Cleanly clear the hash without triggering a full page history back navigation
      window.history.replaceState(null, "", window.location.pathname);
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
          <div className={styles.sidebar}>
            <FeaturedPortrait piece={featuredPiece} />
            <Directory onExpand={openPiece} />
          </div>

          <section className={styles.grid} aria-label="generative art grid">
            {gridPieces.map((piece) => (
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
