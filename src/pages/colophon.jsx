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
  { name: "blush", hex: "#fecfe2" },
  { name: "matcha", hex: "#d9efce" },
  { name: "wisteria", hex: "#e3d9fb" },
  { name: "butter", hex: "#faf0c8" },
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
            a colophon is the note at the end of a book that tells you how it
            was made. this is mine. a small record of the tools, materials,
            colors, typefaces, and technologies behind my work and this little
            corner of the internet. consider it the recipe for everything
            stitched together here.
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
            the same function color code i use across all my soft circuit work —
            power, input, output, wires. once you learn it, you&apos;ll start
            seeing it everywhere on this site, not just here.
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
            stitch in sewing, the first one anyone learns, and the one i keep
            coming back to. the homepage collage is hand-placed, every card and
            photo positioned by eye, the way i&apos;d pin pieces to a corkboard
            above my desk. the little circuit in the nav makes its sound with
            the web audio api, synthesized live — no audio file, just math that
            sounds like electronics.
          </p>
          <p>
            animations respect{" "}
            <code className={styles.mono}>prefers-reduced-motion</code>. i build
            and maintain this whole thing myself, in new york city, which is
            also why the commit messages are in lowercase.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>provenance</h2>
          <p>
            electrocute lab has been running since 2021, with roots going back
            to 2015. this site is my front porch: where i document soft
            electronics, e-textiles, physical computing, and generative text —
            the practice i call poetronics. soft on the outside, technically
            rigorous underneath. same as me.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
