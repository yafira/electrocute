import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import electronicText, { buildStanza } from "../../data/electronicText";
import styles from "../../styles/ElectronicText.module.css";

const TAGLINE = "poems written by rules, grammars, and chance";

// each tile previews the piece's own text, the way it shows up when
// you open it: a freshly built stanza for a computer of ___, one of
// ribbon logic's poems, or the opening of a single poem. the first
// render uses fixed text so the server and browser agree, then the
// page swaps in a new one.
function firstText(piece) {
  if (piece.kind === "live") return piece.sample;
  if (piece.kind === "poems") return piece.poems[0].text;
  return piece.text;
}

function freshText(piece) {
  if (piece.kind === "live") return buildStanza();
  if (piece.kind === "poems") {
    const poems = piece.poems;
    return poems[Math.floor(Math.random() * poems.length)].text;
  }
  return piece.text;
}

function TilePreview({ piece }) {
  const [text, setText] = useState(() => firstText(piece));

  useEffect(() => {
    setText(freshText(piece));
  }, [piece]);

  // each line keeps its indent, and wraps under itself if it runs long
  return (
    <span className={styles.tileText}>
      {text.split("\n").map((line, i) => {
        const indent = line.length - line.trimStart().length;
        return (
          <span
            key={i}
            className={styles.tileLine}
            style={{ "--indent": `${indent}ch` }}
          >
            {line.trim() || "\u00a0"}
          </span>
        );
      })}
    </span>
  );
}

function Tile({ piece }) {
  return (
    <Link href={`/electronic-text/${piece.slug}`} className={styles.tile}>
      <span className={styles.tileHead}>
        <span className={styles.index}>{piece.index}</span>
        <span className={styles.tileTools}>{piece.tools.join(" / ")}</span>
      </span>
      <span className={styles.tileFrame}>
        <TilePreview piece={piece} />
      </span>
      <span className={styles.tileFoot}>
        <span className={styles.tileTitle}>{piece.title}</span>
        {piece.summary && (
          <span className={styles.tileSummary}>{piece.summary}</span>
        )}
      </span>
    </Link>
  );
}

export default function ElectronicText() {
  return (
    <>
      <Head>
        <title>electronic text</title>
        <meta
          name="description"
          content="generative poems and poetry objects from electrocute lab"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Pixelify+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.header}>
          <a className={styles.eyebrow} href="https://electrocute.io">
            {"←"} electrocute.io
          </a>
          <h1 className={styles.title1}>electronic text</h1>
          <p className={styles.tagline}>{TAGLINE}</p>
        </header>

        <section className={styles.grid} aria-label="generative text pieces">
          {electronicText.map((piece) => (
            <Tile key={piece.slug} piece={piece} />
          ))}
        </section>

        <footer className={styles.footer}>
          <a href="https://electrocute.io">electrocute lab</a>
        </footer>
      </main>
    </>
  );
}
