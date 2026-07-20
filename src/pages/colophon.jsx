import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/Colophon.module.css";

// the colophon reads like a bill of materials — the site described
// the way a soft circuit kit would describe itself. every row is a
// real dependency or material, not decoration.

const MATERIALS = [
  ["framework", "next.js (pages router) + react"],
  ["styling", "css modules, hand-written — no tailwind, no ui kit"],
  ["design system", "electrocute-ui, published on npm"],
  ["motion", "framer-motion page fades + hand-rolled css keyframes"],
  ["generative text", "tracery-grammar"],
  ["icons", "font awesome + hand-drawn svg doodads"],
  ["api bits", "upstash redis via vercel serverless functions"],
  ["hosting", "vercel, deployed on every push to main"],
];

const TYPEFACES = [
  ["space grotesk", "body text — technical but rounded at the corners"],
  ["poppins (thin weights)", "long-form prose"],
  ["ibm plex mono", "labels, urls, anything that should feel machine-adjacent"],
  ["cute font", "exactly where you'd expect"],
];

const COLOR_CODE = [
  { name: "blush", hex: "#fecfe2", role: "power" },
  { name: "matcha", hex: "#d9efce", role: "input" },
  { name: "wisteria", hex: "#e3d9fb", role: "output" },
  { name: "butter", hex: "#faf0c8", role: "wires" },
];

export default function Colophon() {
  return (
    <div className={styles.container}>
      <Head>
        <title>colophon — electrocute</title>
        <meta
          name="description"
          content="how this site is made: the stack, the type, the color code, and the stitches holding it together."
        />
        <meta property="og:title" content="colophon — electrocute" />
        <meta
          property="og:description"
          content="how this site is made: the stack, the type, the color code, and the stitches."
        />
      </Head>

      <Header />

      <main className={styles.colophon}>
        <section className={styles.intro}>
          <span className={styles.eyebrow}>bill of materials</span>
          <h1>colophon</h1>
          <p>
            in bookmaking, a colophon is the little note at the end that says
            how the thing was made — the type, the paper, the press. this is
            that, for a website. everything below is real: real dependencies,
            real hex values, real stitches.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>materials</h2>
          <dl className={styles.specList}>
            {MATERIALS.map(([label, value]) => (
              <div className={styles.specRow} key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>type</h2>
          <dl className={styles.specList}>
            {TYPEFACES.map(([label, value]) => (
              <div className={styles.specRow} key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>the color code</h2>
          <p className={styles.sectionNote}>
            the same function color code used across electrocute lab&apos;s soft
            circuits — if you&apos;ve seen the electric craft kit, these are the
            petals.
          </p>
          <ul className={styles.swatches}>
            {COLOR_CODE.map((c) => (
              <li
                className={styles.swatch}
                key={c.name}
                style={{ "--swatch": c.hex }}
              >
                <span className={styles.swatchChip}>
                  <span className={styles.swatchSnap} aria-hidden="true" />
                </span>
                <span className={styles.swatchName}>{c.name}</span>
                <span className={styles.swatchRole}>{c.role}</span>
                <span className={styles.swatchHex}>{c.hex}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>construction notes</h2>
          <p>
            the dashed borders everywhere are running stitches — the most basic
            stitch in sewing, the first one anyone learns. the homepage collage
            is hand-placed, every card and photo positioned by eye the way
            you&apos;d pin pieces to a corkboard. the little bench doodads (the
            knob, the toggle, the oscilloscope) make their sounds with the web
            audio api, synthesized live — no audio files.
          </p>
          <p>
            animations respect{" "}
            <code className={styles.mono}>prefers-reduced-motion</code>. the
            site is built and maintained by one person in new york city, which
            is also why the commit messages are in lowercase.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>provenance</h2>
          <p>
            electrocute lab has been running since 2021, with roots going back
            to 2015. this site is its front porch: a place to document soft
            electronics, e-textiles, physical computing, and generative text —
            the practice i call poetronics. soft on the outside, technically
            rigorous underneath.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
