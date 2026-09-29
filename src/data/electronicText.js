// pieces for /electronic-text.
// kind decides how each one is shown:
//   live  → the piece itself, embedded from /public
//   poems → sample outputs printed as text, plus a photo of the object
//   poem  → a single styled poem
// each piece gets a tile on /electronic-text and its own page at
// /electronic-text/[slug]. summary is the one line shown on the tile.

// the vocabulary of a computer of ___ (from "my words"), used to build
// a new stanza on its tile each time the page opens
const MINE = {
  material: [
    "felt",
    "knit",
    "tulle",
    "conductive thread",
    "soft silicone",
    "foam",
    "velvet",
    "gel",
    "mesh",
    "industrial felt",
    "cloud fiber",
  ],
  structure: [
    "stitched with running thread",
    "sealed with a slow zipper",
    "laced with ribbon logic",
    "held by snaps and patience",
    "taped with care (temporary)",
    "woven in loops that remember",
  ],
  power: [
    "moonlight",
    "usb power",
    "a warm battery",
    "static",
    "a dim wall outlet",
    "no power at all",
    "a shared charge",
  ],
  interface: [
    "a keyboard that blushes when touched",
    "a screen that refuses urgency",
    "buttons that only work if you're gentle",
    "a dial that drifts like weather",
    "a touchpad made of cloth and friction",
    "a cursor that waits for your breath",
  ],
  location: [
    "under a desk lamp at midnight",
    "in a room where time is slower",
    "inside a tote bag",
    "by the window with quiet air",
    "in the studio after critique",
    "near a plant that survives anyway",
  ],
  inhabitant: [
    "people who log off early",
    "hands learning softness",
    "a shy machine spirit",
    "tired students and their prototypes",
    "a small archive of care",
    "memories that don't want to be optimized",
  ],
  promise: [
    "it will not rush you",
    "it will misbehave politely",
    "it will keep your secrets imperfectly",
    "it will take breaks with you",
    "it will glow only when needed",
    "it will never ask for your attention twice",
  ],
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export function buildStanza() {
  return [
    `A computer of ${pick(MINE.material)}`,
    `  ${pick(MINE.structure)}`,
    `    powered by ${pick(MINE.power)}`,
    `      with ${pick(MINE.interface)}`,
    `        resting ${pick(MINE.location)}`,
    `          inhabited by ${pick(MINE.inhabitant)}`,
    `            and ${pick(MINE.promise)}.`,
  ].join("\n");
}

const electronicText = [
  {
    slug: "a-computer-of",
    index: "01",
    title: "a computer of ___",
    year: "2026",
    tools: ["javascript", "generative grammar"],
    kind: "live",
    summary: "a live poem of soft computers that you can write into.",
    // shown on the tile before the page builds a fresh stanza
    sample:
      "A computer of felt\n  laced with ribbon logic\n    powered by moonlight\n      with a screen that refuses urgency\n        resting inside a tote bag\n          inhabited by a shy machine spirit\n            and it will not rush you.",
    embedPath: "/text/a-computer-of/index.html",
    blurb:
      'a generator of soft computers: imaginary machines made of fabric, powered gently, built without urgency. each stanza assembles one machine in seven steps, each line stepping further in. in "our words" you can write your own parts of the machine, and they get braided in with mine. ribbon logic is its expanded version in physical form.',
    origin:
      "began as a python notebook in reading and writing electronic text (allison parrish, nyu itp).",
    links: [
      { label: "open on its own", href: "/text/a-computer-of/index.html" },
      { label: "ribbon logic", href: "/electronic-text/ribbon-logic" },
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
    summary:
      "a one-button poetry object that changes temperature with every press.",
    image: "/assets/craft/ribbon-logic.png",
    hoverImage: "/assets/craft/ribbon-logic.gif",
    blurb:
      "a small button-press poetry object. a markov chain built from my own freewriting meets vocabulary pulled from the class's hand-tagged semantic corpus, and a rejection rule refuses any word tagged cold, sharp, or academic. each press shifts the temperature between cool, neutral, and warm and picks a new poem form.",
    origin:
      'made for reading and writing electronic text (allison parrish, nyu itp). adafruit qualia esp32-s3, 2.1" round display, one button.',
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
      {
        label: "project notes",
        href: "https://months-tap-da9.craft.me/ribbon-logic",
      },
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
    year: null,
    tools: ["markov chain"],
    kind: "poem",
    summary: "a markov chain poem about a mind assembling itself.",
    blurb:
      "a poem generated with a markov chain. a markov chain only remembers what usually comes next, never where it started, which gives the title a second meaning. its companion is reboot ritual.",
    text: [
      "her fingertips swam in memory,",
      "a low murmur across copper fields\u2014",
      "the static of brain-storms",
      "washed over her like salt.",
      "",
      "she moved like a current of forgotten thought,",
      "a logic wrapped in velvet syntax,",
      "trailing magnetic codes of quiet tragedy",
      "through alleyways of chrome.",
      "",
      "\u201ceverything burns in silence,\u201d she said,",
      "her words flowering like spectral algorithms.",
      "",
      "the sky had cracked like porcelain.",
      "wires wept silver in the night.",
      "electric moons flickered above broken glass.",
      "",
      "she was not asleep, but assembled\u2014",
      "thought soldered to thought,",
      "gleaming in artificial grace.",
      "she opened her eyes",
      "and uploaded herself into the dusk.",
    ].join("\n"),
    links: [],
  },
  {
    slug: "reboot-ritual",
    index: "04",
    title: "reboot ritual",
    year: null,
    tools: ["markov chain"],
    kind: "poem",
    summary: "a markov chain poem about starting over.",
    blurb:
      "a poem generated with a markov chain, and the companion to memory drift.",
    text: [
      "she entered like light through a firewall,",
      "soft as static, sharp as loss.",
      "",
      "beneath her skin, something hummed,",
      "a code she couldn\u2019t name.",
      "the system paused to listen.",
      "",
      "dreams echoed in binary,",
      "folded beneath cracked time.",
      "",
      "she smiled,",
      "rewrote her origin,",
      "and pressed restart.",
    ].join("\n"),
    links: [],
  },
];

export default electronicText;
