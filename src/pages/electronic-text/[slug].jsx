import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import electronicText from "../../data/electronicText";
import styles from "../../styles/ElectronicText.module.css";

// the live piece, embedded from /public. it reports its own height
// through postMessage so the frame grows with the poem instead of
// scrolling inside itself.
function LivePiece({ piece }) {
  const frameRef = useRef(null);
  const [height, setHeight] = useState(760);

  const measure = () =>
    frameRef.current?.contentWindow?.postMessage(
      { type: "acomputerof:measure" },
      "*",
    );

  useEffect(() => {
    const onMessage = (e) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.type === "acomputerof:height") {
        setHeight(Math.ceil(e.data.height));
      }
    };
    window.addEventListener("message", onMessage);
    // the frame may have reported before this listener existed, so ask it again
    measure();
    return () => window.removeEventListener("message", onMessage);
  }, [piece.slug]);

  return (
    <iframe
      ref={frameRef}
      className={styles.liveFrame}
      src={`${piece.embedPath}?embed`}
      title={piece.title}
      onLoad={measure}
      style={{ height }}
    />
  );
}

// sample outputs beside a photo of the object. hovering the photo
// swaps in the moving version when there is one.
function PoemsPiece({ piece }) {
  return (
    <div className={styles.poemsLayout}>
      <figure className={styles.photo}>
        <img
          className={styles.photoBase}
          src={piece.image}
          alt={`${piece.title}, the object`}
        />
        {piece.hoverImage && (
          <img className={styles.photoHover} src={piece.hoverImage} alt="" />
        )}
      </figure>
      <div className={styles.samples}>
        {piece.poems.map((poem) => (
          <div key={poem.label} className={styles.sample}>
            <span className={styles.sampleLabel}>{poem.label}</span>
            <pre className={styles.sampleText}>{poem.text}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

// a single poem, set as its own dark block with a pixel title
function PoemPiece({ piece }) {
  if (!piece.text) {
    return <p className={styles.pending}>poem coming soon.</p>;
  }
  return (
    <div className={styles.poemBlock}>
      <p className={styles.poemTitle}>{piece.title}</p>
      <pre className={styles.poemText}>{piece.text}</pre>
    </div>
  );
}

export default function TextPiece({ slug }) {
  const i = electronicText.findIndex((p) => p.slug === slug);
  const piece = electronicText[i];
  const prev = electronicText[i - 1];
  const next = electronicText[i + 1];

  return (
    <>
      <Head>
        <title>{`${piece.title} · electronic text`}</title>
        <meta name="description" content={piece.summary || piece.title} />
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
        <article className={styles.detail}>
          <header className={styles.detailHeader}>
            <Link className={styles.eyebrow} href="/electronic-text">
              {"←"} electronic text
            </Link>
            <div className={styles.pieceHead}>
              <span className={styles.index}>{piece.index}</span>
              <h1 className={styles.pieceTitle}>{piece.title}</h1>
              <span className={styles.meta}>
                {[piece.year, ...piece.tools].join(" / ")}
              </span>
            </div>
            {piece.blurb && <p className={styles.blurb}>{piece.blurb}</p>}
          </header>

          <div className={styles.work}>
            {piece.kind === "live" && <LivePiece piece={piece} />}
            {piece.kind === "poems" && <PoemsPiece piece={piece} />}
            {piece.kind === "poem" && <PoemPiece piece={piece} />}
          </div>

          {(piece.origin || piece.links.length > 0) && (
            <div className={styles.pieceFoot}>
              {piece.origin && <p className={styles.origin}>{piece.origin}</p>}
              {piece.links.length > 0 && (
                <ul className={styles.links}>
                  {piece.links.map((link) => {
                    const external = link.href.startsWith("http");
                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {link.label} {"↗"}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </article>

        <nav className={styles.pager} aria-label="other pieces">
          {prev ? (
            <Link href={`/electronic-text/${prev.slug}`}>
              {"←"} {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/electronic-text/${next.slug}`}>
              {next.title} {"→"}
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <footer className={styles.footer}>
          <a href="https://electrocute.io">electrocute lab</a>
        </footer>
      </main>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: electronicText.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
