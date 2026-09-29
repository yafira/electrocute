// my vocabulary, from the original generator
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

// the seven-line cascade
const CASCADE = [
  ["A computer of ", "material", ""],
  ["", "structure", ""],
  ["powered by ", "power", ""],
  ["with ", "interface", ""],
  ["resting ", "location", ""],
  ["inhabited by ", "inhabitant", ""],
  ["and ", "promise", "."],
];
const SLOTS = CASCADE.map((c) => c[1]);

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const state = { src: "ours" };
const theirs = {};
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// the reader's phrases for one slot
function yourWords(slot) {
  return (theirs[slot] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// one slot's word: mine, or in our words a coin toss between mine and theirs
function fill(slot) {
  const yours = yourWords(slot);
  if (state.src === "mine") return { word: pick(MINE[slot]), mine: false };
  // an even chance either way, so a single phrase of theirs is as likely as my whole list
  if (yours.length && Math.random() < 0.5)
    return { word: pick(yours), mine: true };
  return { word: pick(MINE[slot]), mine: false };
}

function buildStanza() {
  return CASCADE.map(([pre, slot, post]) => ({
    pre,
    post,
    slot,
    ...fill(slot),
  }));
}

function fillLine(el, l) {
  el.textContent = "";
  el.append(l.pre);
  const w = document.createElement("span");
  // each part of the machine has its own pastel, set in style.css
  w.className = "w slot-" + l.slot + (l.mine ? " mine" : "");
  w.textContent = l.word;
  el.append(w, l.post);
}

const stage = document.getElementById("stage");
const history = [];
let building = false;

function render() {
  stage.textContent = "";
  history.forEach((s, idx) => {
    const st = document.createElement("span");
    st.className = "stanza" + (idx < history.length - 1 ? " old" : "");
    s.forEach((l, i) => {
      const el = document.createElement("span");
      el.className = "line";
      el.style.setProperty("--i", i);
      fillLine(el, l);
      st.append(el);
    });
    stage.append(st);
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function another() {
  if (building) return;
  building = true;
  history.push(buildStanza());
  if (history.length > 4) history.shift();
  render();
  if (!reduced) {
    const lines = [...stage.lastElementChild.children];
    lines.forEach((el) => el.classList.add("pending"));
    for (const el of lines) {
      el.classList.remove("pending");
      await wait(260);
    }
  }
  building = false;
}

// a little sample of how the reader's words look, shown after the hint
function yoursMark() {
  const m = document.createElement("span");
  m.className = "mark";
  m.textContent = "yours look like this";
  return m;
}

function setHint() {
  const given = SLOTS.filter((s) => yourWords(s).length).length;
  const h = document.getElementById("hint");
  if (state.src === "mine")
    h.textContent = "Click the poem or press space to build another.";
  else if (given) {
    h.textContent = "Each line comes from my phrases or yours. ";
    h.append(yoursMark());
  } else
    h.textContent =
      "Write into the fields below and your phrases will be braided in with mine.";
}

function sync() {
  ["mine", "ours"].forEach((k) =>
    document
      .getElementById("src-" + k)
      .setAttribute("aria-pressed", state.src === k),
  );
  document.getElementById("yours").hidden = state.src === "mine";
  setHint();
}

["mine", "ours"].forEach((k) => {
  document.getElementById("src-" + k).onclick = () => {
    state.src = k;
    sync();
    another();
  };
});

// the reader's phrases stay in their own browser between visits, when the browser allows it
const KEY = "acomputerof-words";
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(theirs));
  } catch (e) {}
}
function load() {
  try {
    Object.assign(theirs, JSON.parse(localStorage.getItem(KEY) || "{}"));
  } catch (e) {}
  SLOTS.forEach((s) => {
    document.getElementById("f-" + s).value = theirs[s] || "";
  });
}
SLOTS.forEach((s) => {
  document.getElementById("f-" + s).addEventListener("input", (e) => {
    theirs[s] = e.target.value;
    save();
    setHint();
  });
});
document.getElementById("yours").addEventListener("submit", (e) => {
  e.preventDefault();
  another();
});
document.getElementById("clear-yours").onclick = () => {
  SLOTS.forEach((s) => {
    theirs[s] = "";
    document.getElementById("f-" + s).value = "";
  });
  save();
  setHint();
};

document.getElementById("again").onclick = another;
stage.onclick = another;
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target === document.body) {
    e.preventDefault();
    another();
  }
});

// each visit starts with a finished machine already on the page
load();
sync();
history.push(buildStanza());
render();

// when embedded with ?embed, hide the header and footer and tell the host page how tall to be
if (new URLSearchParams(location.search).has("embed")) {
  document.documentElement.classList.add("embed");
  const report = () =>
    parent.postMessage(
      {
        type: "acomputerof:height",
        height: document.documentElement.scrollHeight,
      },
      "*",
    );
  new ResizeObserver(report).observe(document.body);
  // the host may start listening after this runs, so it can ask again
  window.addEventListener("message", (e) => {
    if (e.data?.type === "acomputerof:measure") report();
  });
  report();
}
