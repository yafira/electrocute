// everything on the home canvas — cards and photos alike — carries a
// `pos` that places it on one shared freeform collage:
//   x, y  → the piece's CENTER, as % of the collage width/height
//   rot   → resting tilt in degrees
//   z     → stacking order where pieces overlap (higher = on top)
// cards also have:
//   shape → "wide" (big index card) | "sticky" (squarer note) |
//           "pill" (soft, very rounded)
// photos also have:
//   w     → rendered width in px
//   delay → float animation offset so they don't bob in sync

const projects = [
  {
    slug: "electrocute-ui",
    title: "electrocute-ui",
    href: "https://ui.electrocute.io",
    icon: "/assets/ecuteui.png",
    blurb: "a design system for Electrocute Lab. published on npm",
    tint: "#fdf1f9",
    hoverBg: "#f2b9e0",
    hoverBorder: "#e88fc9",
    shape: "sticky",
    pos: { x: "12%", y: "8%", rot: -2, z: 10 },
  },
  {
    slug: "soft-interfaces",
    title: "soft interfaces",
    href: "/soft-interfaces",
    icon: "/assets/s_i.png",
    blurb:
      "a craft collective of soft machines, textile circuits, and tangible interfaces built at electrocute lab.",
    tint: "#f5f7f8",
    hoverBg: "#e9ecef",
    hoverBorder: "#dadfe5",
    shape: "wide",
    pos: { x: "72%", y: "9%", rot: 1, z: 10 },
  },
  {
    slug: "electrodex",
    title: "electrodex",
    href: "/electrodex",
    icon: "/assets/edex.png",
    blurb:
      "a linked list of creative spaces, communities, and digital niches in nyc & beyond. (WIP)",
    tint: "#ebfaf2",
    hoverBg: "#dbf7e6",
    hoverBorder: "#bbf0cf",
    shape: "pill",
    pos: { x: "34%", y: "32%", rot: 0.8, z: 10 },
  },
  {
    slug: "soft-circuit-library",
    title: "soft circuit library",
    href: "https://months-tap-da9.craft.me/soft-circuit-lib",
    icon: "/assets/softlib.png",
    blurb:
      "a collection of card-sized soft circuits housed in an archival index box. Repair is dated, annotated, and made part of the object.",
    tint: "#fff4e8",
    hoverBg: "#fbecdd",
    hoverBorder: "#e7c29d",
    shape: "wide",
    pos: { x: "66%", y: "46%", rot: -1.2, z: 10 },
  },
  {
    slug: "synthwave-chimes",
    title: "synthwave chimes",
    href: "https://synthwave-chimes.netlify.app/",
    icon: "/assets/flower.png",
    blurb: "a digital synth chime that blends shapes with interactive sound.",
    tint: "#f5e6fd",
    hoverBg: "#e9d4f4",
    hoverBorder: "#e89cf1",
    shape: "sticky",
    pos: { x: "13%", y: "65%", rot: 1.6, z: 10 },
  },
  {
    slug: "sailor-moon-calculator",
    title: "sailor moon calculator",
    href: "https://sailor-moon-calculator.netlify.app/",
    icon: "/assets/calc.png",
    blurb:
      "a basic on-screen calculator inspired by one of the communicators used in Sailor Moon.",
    tint: "#fffee9",
    hoverBg: "#fcfade",
    hoverBorder: "#f7f3cf",
    shape: "pill",
    pos: { x: "72%", y: "63%", rot: -0.8, z: 10 },
  },
  {
    slug: "snax",
    title: "snax",
    href: "https://snax.blog",
    icon: "/assets/snax.png",
    blurb:
      "a pokedex-like blog for sharing my own reviews and ratings on vegan/plant-based snacks and bevs. Also a peanut-free zone.",
    tint: "#fff3f8",
    hoverBg: "#fae7ef",
    hoverBorder: "#fecfe2",
    shape: "wide",
    pos: { x: "36%", y: "80%", rot: 1, z: 10 },
  },
];

// toolkits, templates, and guides — resources for other people to use,
// rather than write-ups of my own objects/projects. shown in their
// own grid below the collage.
export const resources = [
  {
    slug: "ecute-club",
    title: "ecute club",
    href: "https://ecute.club/",
    icon: "/assets/ecute.png",
    blurb: "a soft start guide to electronics.",
    tint: "#e8e6ff",
    hoverBg: "#bdb8f1",
    hoverBorder: "#9d96e7",
  },
  {
    slug: "kawaii-ml",
    title: "kawaii ML",
    href: "https://www.figma.com/community/file/1282166884816539041/Kawaii-ML-Deck",
    icon: "/assets/kml.png",
    blurb: "a card deck referencing the top 10 machine learning algorithms.",
    tint: "#ecfff9",
    hoverBg: "#d9f9ef",
    hoverBorder: "#94f1d3",
  },
  {
    slug: "design-hub",
    title: "design hub",
    href: "https://electrocute.gumroad.com/l/design-hub",
    icon: "/assets/dhub.png",
    blurb:
      "a Notion template to keep track of your progress on design learnings and all around journey.",
    tint: "#fcf7ec",
    hoverBg: "#fcf3e1",
    hoverBorder: "#f1dbcc",
  },
  {
    slug: "coding-hub",
    title: "coding hub",
    href: "https://electrocute.gumroad.com/l/coding-hub",
    icon: "/assets/chub.png",
    blurb:
      "a Notion template to keep track of your programming progress and all around coding journey.",
    tint: "#f2f8ff",
    hoverBg: "#dae9fa",
    hoverBorder: "#b4d4f9",
  },
  {
    slug: "cute-folder-pack",
    title: "cute folder icon pack",
    href: "https://electrocute.gumroad.com/l/cute-folder-pack",
    icon: "/assets/cutefolder.png",
    blurb:
      "a cute folder icon pack in pastel, neutral, and monochrome shades, named after macaron flavors and other delicacies.",
    tint: "#f6fffe",
    hoverBg: "#eafdfc",
    hoverBorder: "#bdfef8",
  },
  {
    slug: "tinytinker-tools",
    title: "tinytinker.tools",
    href: "https://tinytinker.tools",
    icon: "/assets/ttt.png",
    blurb: "an open source handmade web toolkit for makers & tinkerers",
    tint: "#ffffd8",
    hoverBg: "#fbfbc8",
    hoverBorder: "#fafac9",
  },
  {
    slug: "cute-technologies",
    title: "cute technologies",
    href: "https://cutetech.tools",
    icon: "/assets/cutetech.png",
    blurb:
      "a digital catalog featuring a collection of cybertwee functional tools and resources to make your computing .env cuter.",
    tint: "#f3faea",
    hoverBg: "#edfdda",
    hoverBorder: "#d8f0ba",
  },
];

export const photoItems = [
  {
    slug: "petalbyte",
    title: "petalbyte",
    image: "/assets/craft/petalbyte.png",
    href: "https://months-tap-da9.craft.me/petalbyte",
    pos: { x: "38%", y: "13%", w: 180, rot: -6, z: 6, delay: 0 },
  },
  {
    slug: "the-soft-computer",
    title: "the soft computer",
    image: "/assets/craft/the-soft-computer.png",
    href: "https://thesoft.computer/",
    pos: { x: "88%", y: "24%", w: 215, rot: 3, z: 12, delay: 0.6 },
  },
  {
    slug: "ribbon-logic",
    title: "ribbon logic",
    image: "/assets/craft/ribbon-logic.png",
    href: "https://months-tap-da9.craft.me/ribbon-logic",
    pos: { x: "9%", y: "29%", w: 190, rot: -4, z: 6, delay: 1.8 },
  },
  {
    slug: "moonpocket",
    title: "moonpocket",
    image: "/assets/craft/moonpocket.png",
    href: "https://months-tap-da9.craft.me/moonpocket",
    pos: { x: "20%", y: "49%", w: 195, rot: 2, z: 6, delay: 0.9 },
  },
  {
    slug: "pocket-oracle-of-time",
    title: "pocket oracle of time",
    image: "/assets/craft/pocket-oracle-of-time.png",
    href: "https://months-tap-da9.craft.me/oracle",
    pos: { x: "43%", y: "64%", w: 160, rot: 5, z: 6, delay: 1.2 },
  },
  {
    slug: "puffcast",
    title: "puffcast",
    image: "/assets/craft/puffcast.png",
    href: "https://months-tap-da9.craft.me/cIaDWsryPp9LdS",
    pos: { x: "70%", y: "79%", w: 185, rot: -5, z: 6, delay: 2.4 },
  },
  {
    slug: "custom-light-leds",
    title: "custom light LEDs",
    image: "/assets/craft/custom-leds.jpg",
    href: "https://www.craft.me/s/UPIseOWDQQ2AAx",
    pos: { x: "9%", y: "91%", w: 165, rot: 4, z: 4, delay: 1.5 },
  },
  {
    slug: "electrojute",
    title: "electrojute",
    image: "/assets/craft/electrojute.png",
    href: "https://www.craft.do/s/n728rE3K9pjrQx",
    pos: { x: "90%", y: "88%", w: 175, rot: -3, z: 6, delay: 0.3 },
  },
];

export default projects;
