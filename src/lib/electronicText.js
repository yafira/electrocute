// pieces for /electronic-text.
// kind decides how each one is shown:
//   live  → the piece itself, embedded from /public
//   poems → sample outputs printed as text, plus a photo of the object
//   poem  → a single styled poem
// each piece gets a tile on /electronic-text and its own page at
// /electronic-text/[slug]. summary is the one line shown on the tile.

const electronicText = [
  {
    slug: "a-computer-of",
    index: "01",
    title: "a computer of ___",
    year: "2026",
    tools: ["javascript", "generative grammar"],
    kind: "live",
    summary: "a live poem of soft computers that you can write into.",
    // shown on the tile, a stanza from "my words"
    sample:
      "A computer of felt\n  laced with ribbon logic\n    powered by moonlight\n      with a screen that refuses urgency\n        resting inside a tote bag\n          inhabited by a shy machine spirit\n            and it will not rush you.",
    embedPath: "/text/a-computer-of/index.html",
    blurb:
      "a generator of soft computers: imaginary machines made of fabric, powered gently, built without urgency. each stanza assembles one machine in seven steps, each line stepping further in. in \"our words\" you can write your own parts of the machine, and they get braided in with mine.",
    origin:
      "began as a python notebook in reading and writing electronic text (allison parrish, nyu itp).",
    links: [
      { label: "open on its own", href: "/text/a-computer-of/index.html" },
      {
        label: "notebook",
        href: "https://github.com/yafira/electronic-txt/blob/main/poetry_generator.ipynb",
      },
    ],
  },
  {
    slug: "ribbon-logic",
    index: "02",
    title: "ribbon logic",
    year: "2026",
    tools: ["circuitpython", "markov chain", "semantic corpus"],
    kind: "poems",
    summary: "a one-button poetry object that changes temperature with every press.",
    image: "/assets/craft/ribbon-logic.png",
    hoverImage: "/assets/craft/ribbon-logic.gif",
    blurb:
      "a small button-press poetry object. a markov chain built from my own freewriting meets vocabulary pulled from the class's hand-tagged semantic corpus, and a rejection rule refuses any word tagged cold, sharp, or academic. each press shifts the temperature between cool, neutral, and warm and picks a new poem form.",
    origin:
      "made for reading and writing electronic text (allison parrish, nyu itp). adafruit qualia esp32-s3, 2.1\" round display, one button.",
    // diamond-form outputs from ribbon_logic.ipynb, one per temperature
    poems: [
      {
        label: "cool",
        text: "a computer of flute-player\n   again\n      threads\n         the\n      loop\n   lust\nstrong",
      },
      {
        label: "neutral",
        text: "a computer of bodies\n   breast\n      praise\n         stocking\n      salon\n   you\nfancies",
      },
      {
        label: "warm",
        text: "a computer of hand\n   ease\n      home\n         lap\n      aura\n   enchanted\nfunny",
      },
    ],
    links: [
      { label: "project notes", href: "https://months-tap-da9.craft.me/ribbon-logic" },
      {
        label: "code",
        href: "https://github.com/yafira/electronic-txt/tree/main/ribbon%20logic",
      },
    ],
  },
  {
    slug: "memory-drift",
    index: "03",
    title: "memory drift",
    year: "2026",
    tools: ["generative text"],
    kind: "poem",
    summary: "", // TODO: one line for the tile
    blurb: "", // TODO: one or two lines about memory drift
    // TODO: paste the poem here, one line per line break
    text: "",
    links: [],
  },
];

export default electronicText;
