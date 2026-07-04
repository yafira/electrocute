import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/SoftInterfaces.module.css";

const PROJECTS = [
  {
    id: "soft-computer",
    name: "the soft computer",
    glyph: "A",
    tint: "blush",
    materials:
      "machine knit wool cotton, felt, conductive thread, e ink, raspberry pi 5",
    blurb:
      "a textile computer. a machine knit lavender panel with four felt buttons, a stitched trackpad, and a flexible e ink display. it writes markov chain poetry from four corpora and prints fortunes on receipt paper. my itp thesis on calm, anti optimization computing.",
    link: "https://thesoft.computer",
    img: "../assets/soft-computer.png",
    fit: "contain",
    wide: true,
  },
  {
    id: "soft-computer-mini",
    name: "soft computer mini",
    glyph: "B",
    tint: "sky",
    materials:
      "feather rp2040, 5.83 inch e ink, felt keyboard, machine knit draw bar",
    blurb:
      "the travel sized sibling of the soft computer, built to demo at open hardware summit berlin. same spirit, smaller suitcase.",
    link: null,
    img: "../assets/soft-computer-mini.png",
    fit: "contain",
    wide: false,
  },
  {
    id: "pocket-oracle-of-time",
    name: "pocket oracle of time",
    glyph: "C",
    tint: "butter",
    materials: "real time clock, e ink display, exposed electronics",
    blurb:
      "what if time was held instead of chased? a small handheld timekeeping device that treats time as something soft and emotional rather than rigid and mechanical. it quietly keeps precise time while reflective messages surface throughout the day, small pauses in the rhythm of everyday life. no buttons, nothing asked of the hand. every fifteen minutes the time briefly reveals itself, then recedes. the exposed circuitry is intentional, a reminder that timekeeping, like care, is something made, held, and maintained.",
    link: null,
    img: "../assets/pocket-oracle-of-time.png",
    fit: "contain",
    wide: false,
  },
  {
    id: "puffcast",
    name: "puffcast",
    glyph: "D",
    tint: "mint",
    materials:
      "layered craft foam, arduino nano 33 iot, protoboard, two potentiometers, buttons",
    blurb:
      "a handmade philips hue controller built from layered craft foam, inspired by the chunky foam novelty phones of the 80s and 90s. not entirely soft, there is a soldered protoboard, an arduino nano 33 iot, two potentiometers, and buttons living inside, but the outside has that tactile, almost toy like quality, the kind of thing you want to pick up and hold. it controls brightness, color temperature, and seven lighting scenes at home and at itp, tested in room 404, yes like the not found error, automatically detecting which environment it is in and adapting accordingly. very handmade, very intentional. soft on the outside, hard on the inside. \u00BFpor qu\u00E9 no los dos?",
    link: null,
    img: "../assets/puffcast.png",
    fit: "contain",
    wide: false,
  },
  {
    id: "soft-circuit-library",
    name: "soft circuit library",
    glyph: "E",
    tint: "blush",
    materials: "copper tape, craft foam, coin cells, archival index box",
    blurb:
      "a collection of handmade card sized circuit boards housed in an archival index box, exhibited at temple university libraries. each card renders an electronic function through copper tape traces on craft foam. repairs are not hidden, they are dated, annotated, and made part of the surface. circuits that accumulate their history rather than conceal it.",
    link: null,
    img: "../assets/soft-circuit-lib.png",
    fit: "contain",
    wide: false,
  },
  {
    id: "soft-circuit-boards",
    name: "soft circuit boards",
    glyph: "F",
    tint: "butter",
    materials: "copper tape, craft foam, conductive thread, no soldering",
    blurb:
      "printed circuit boards, but by hand. copper tape traces on craft foam stand in for etched copper on fiberglass, so the board becomes something you can cut, bend, and mend. an ongoing studio practice that also became a hands on workshop at itp camp, where anyone can trace their own board and light something up.",
    link: null,
    img: "../assets/soft-circuit-boards.png",
    fit: "contain",
    wide: false,
  },
  {
    id: "tiny-soft-buttons",
    name: "tiny soft buttons",
    glyph: "G",
    tint: "sky",
    materials: "felt, fabric, conductive materials",
    blurb:
      "not just soft, but squishy, gentle, and fully functional. early computers were deeply tied to textiles, looms, punch cards, weaving as logic, and returning to that lineage through soft materials feels like a quiet return rather than something new. computation has always lived in soft materials. part of a growing library of soft components.",
    link: null,
    img: "../assets/tiny-soft-buttons.png",
    fit: "contain",
    wide: false,
  },
  {
    id: "bio-lume",
    name: "bio-lume",
    glyph: "H",
    tint: "mint",
    materials: "agar agar, arduino nano 33 iot, adafruit neopixel jewel",
    blurb:
      "a temporary bio e-candle; addressable led candle coded to behave like a real flame, warm white, low brightness, slow breathing, randomized flicker, and long pauses of stillness. the neopixels are treated as a single light source, with diffusion doing most of the work. she is temporary because the candle body is cast from agar agar, which diffuses light beautifully but cracks and will eventually collapse. instead of fixing that, the material is allowed to fail as part of the candle's lifecycle.",
    link: null,
    img: "../assets/bio-lume.png",
    fit: "contain",
    wide: false,
  },
];

const TAGLINE =
  "interfaces you can hold, wear, fold, and squish. a collective of soft machines from electrocute lab.";

export default function SoftInterfaces() {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = PROJECTS.find((p) => p.id === selected) || null;

  return (
    <>
      <Head>
        <title>soft interfaces</title>
        <meta
          name="description"
          content="a swatch wall of soft machines, textile circuits, and tangible interfaces from electrocute lab"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jacquard+24&family=Yarndings+20+Charted&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>soft interfaces</h1>
          <p className={styles.tagline}>{TAGLINE}</p>
        </header>

        <section className={styles.wall} aria-label="project swatch wall">
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.swatch} ${styles[p.tint]} ${
                p.wide ? styles.swatchWide : ""
              } ${selected === p.id ? styles.swatchActive : ""}`}
              onClick={() => setSelected(selected === p.id ? null : p.id)}
              aria-expanded={selected === p.id}
            >
              <span className={styles.pin} aria-hidden="true" />
              {p.img ? (
                <img
                  className={
                    p.fit === "cover" ? styles.photoCover : styles.photo
                  }
                  src={p.img}
                  alt=""
                />
              ) : (
                <span className={styles.glyph} aria-hidden="true">
                  {p.glyph}
                </span>
              )}
              <span className={styles.tag}>
                <span className={styles.tagName}>{p.name}</span>
                <span className={styles.tagYear}>{p.year}</span>
              </span>
            </button>
          ))}
        </section>

        {active && (
          <aside
            className={styles.label}
            role="dialog"
            aria-label={active.name}
          >
            <span
              className={`${styles.labelBar} ${styles[active.tint]}`}
              aria-hidden="true"
            />
            <div className={styles.labelBody}>
              <div className={styles.labelHead}>
                <h2 className={styles.labelName}>{active.name}</h2>
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => setSelected(null)}
                  aria-label="close label"
                >
                  {"\u2715"}
                </button>
              </div>
              <p className={styles.labelMeta}>
                {active.year} {"\u00B7"} {active.materials}
              </p>
              <p className={styles.labelBlurb}>{active.blurb}</p>
              {active.link && (
                <a
                  className={styles.labelLink}
                  href={active.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  visit {"\u2197"}
                </a>
              )}
            </div>
          </aside>
        )}

        <footer className={styles.footer}>
          <p>stitched together by electrocute lab {"\u2661"}</p>
          <a
            href="https://instagram.com/softinterfaces"
            target="_blank"
            rel="noreferrer"
            className={styles.instagramLink}
            aria-label="Follow soft interfaces on Instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
        </footer>
      </main>
    </>
  );
}
