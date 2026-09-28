import Head from "next/head";
import Link from "next/link";
import electronicText from "../../data/electronicText";
import styles from "../../styles/ElectronicText.module.css";

const TAGLINE = "poems written by rules, grammars, and chance";

// what each tile shows above its title, by kind: a stanza for live
// pieces, the object's photo for poetry objects, and a dark block with
// the pixel title for single poems
function TilePreview({ piece }) {
  if (piece.kind === "poems") {
    return (
      <span className={styles.tilePhoto}>
        <img src={piece.image} alt="" loading="lazy" />
        {piece.hoverImage && (
          <img
            className={styles.tilePhotoHover}
            src={piece.hoverImage}
            alt=""
            loading="lazy"
          />
        )}
      </span>
    );
  }
  if (piece.kind === "poem") {
    return (
      <span className={styles.tileDark}>
        <span className={styles.tilePixel}>{piece.title}</span>
      </span>
    );
  }
  return (
    <span className={styles.tileText}>
      <pre>{piece.sample}</pre>
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
