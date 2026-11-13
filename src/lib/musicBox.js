// a little generative music box for the status bar speaker.
// it drifts between a few moods: the plucked pentatonic box, a dark low synth,
// a deep drone, glassy echoes, and a slow circuit hum. each mood plays for a
// while, then hands off to a different one, so it never settles into a loop.
// stretches out when slow mode is on.

import { tone, noise } from "./tinySynth";

const D = 146.83; // d3, everything is built from here
const at = (semis) => D * 2 ** (semis / 12);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const chance = (p) => Math.random() < p;
const wobble = (f, amt = 0.004) => f * (1 + (Math.random() - 0.5) * amt);

// scales as semitones from d3
const MAJOR_PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const MINOR = [-12, -10, -9, -7, -5, -4, -2, 0, 2, 3, 5, 7];
const MINOR_PENTA = [12, 15, 17, 19, 22, 24, 27, 29, 31];

// each mood has a beat length in ms, a scale to walk, and what to do on each beat
const moods = {
  musicbox: {
    ms: 560,
    scale: MAJOR_PENTA,
    play(m) {
      if (chance(0.82)) {
        const f = wobble(at(m.scale[walk(m)]) * 2);
        tone(0, { freq: f, dur: 1.4, peak: 0.018, filter: 2400 });
        tone(0, { freq: f * 2, dur: 0.5, peak: 0.004 });
      }
      if (m.beat % 8 === 0) {
        tone(0, { freq: D, dur: 3.5, peak: 0.012, type: "triangle", filter: 600 });
      }
    },
  },

  // dark synth: slow sawtooth notes in d minor, low and filtered, with a sub underneath
  night: {
    ms: 900,
    scale: MINOR,
    play(m) {
      if (chance(0.55)) {
        const f = wobble(at(m.scale[walk(m)]), 0.003);
        const filter = 380 + Math.random() * 700;
        tone(0, { freq: f, dur: 4, peak: 0.011, type: "sawtooth", filter, attack: 0.5 });
        tone(0, { freq: f * 1.006, dur: 4, peak: 0.008, type: "sawtooth", filter, attack: 0.7 });
      }
      if (m.beat % 6 === 0) {
        const root = pick([at(-12), at(-12), at(-16), at(-14)]);
        tone(0, { freq: root, dur: 5.5, peak: 0.02, type: "triangle", filter: 220, attack: 1 });
      }
    },
  },

  // deep drone: two low voices beating against each other, a far-off bell, some wind
  deep: {
    ms: 1100,
    scale: MINOR,
    play(m) {
      if (m.beat % 6 === 0) {
        const root = pick([at(-12), at(-17), at(-14)]);
        tone(0, { freq: root, dur: 9, peak: 0.016, type: "triangle", filter: 300, attack: 2.5 });
        tone(0, { freq: root * 1.5 * 1.003, dur: 9, peak: 0.008, type: "sine", attack: 3 });
      }
      if (chance(0.12)) {
        tone(0, { freq: wobble(at(pick(MINOR_PENTA)) * 2), dur: 4, peak: 0.006, filter: 3000 });
      }
      if (chance(0.08)) {
        noise(0, { dur: 3, peak: 0.006, band: 300 + Math.random() * 500, q: 0.6 });
      }
    },
  },

  // glass: sparse high notes that echo away
  glass: {
    ms: 700,
    scale: MINOR_PENTA,
    play(m) {
      if (chance(0.4)) {
        const f = wobble(at(m.scale[walk(m)]) * 2);
        [0, 0.33, 0.66, 0.99].forEach((t, i) => {
          tone(t, { freq: f, dur: 1.2, peak: 0.012 / (i + 1) ** 1.4, filter: 3500 });
        });
      }
      if (m.beat % 8 === 0) {
        tone(0, { freq: at(-12), dur: 6, peak: 0.01, type: "triangle", filter: 400, attack: 1.5 });
      }
    },
  },

  // circuit hum: a low pulse, little relay clicks, the odd blip
  hum: {
    ms: 480,
    scale: MINOR,
    play(m) {
      if (m.beat % 2 === 0) {
        tone(0, { freq: at(-24), dur: 0.35, peak: 0.02, type: "square", filter: 160 });
      }
      if (chance(0.35)) noise(Math.random() * 0.3, { dur: 0.02, peak: 0.012, band: 3500, q: 6 });
      if (chance(0.15)) {
        const f = at(m.scale[walk(m)] + 12);
        tone(0, { freq: f, to: f * pick([0.5, 1.5, 2]), dur: 0.25, peak: 0.007, type: "square", filter: 1800 });
      }
    },
  },
};

const names = Object.keys(moods);

let timer = null;
let current = null;

// a gentle random walk up and down the mood's scale
function walk(m) {
  m.step = Math.min(m.scale.length - 1, Math.max(0, m.step + pick([-2, -1, -1, 1, 1, 2])));
  return m.step;
}

function switchTo(name) {
  const mood = moods[name];
  current = {
    name,
    ...mood,
    step: Math.floor(mood.scale.length / 2),
    beat: 0,
    // how many beats before it wanders off somewhere else
    length: 24 + Math.floor(Math.random() * 32),
  };
}

const isSlow = () => document.documentElement.classList.contains("slow-mode");

function play() {
  if (current.beat >= current.length) {
    switchTo(pick(names.filter((n) => n !== current.name)));
  }
  current.play(current);
  current.beat++;
  timer = setTimeout(play, current.ms * (isSlow() ? 2.5 : 1));
}

export const musicPlaying = () => timer !== null;

export function startMusic() {
  if (timer) return;
  // each press opens on a different mood
  switchTo(pick(names));
  play();
}

export function stopMusic() {
  clearTimeout(timer);
  timer = null;
}
