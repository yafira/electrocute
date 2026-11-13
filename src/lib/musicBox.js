// a little generative music box for the status bar speaker.
// wanders up and down a d major pentatonic, rests now and then,
// with a soft low drone every few bars. never plays the same tune twice.
// stretches out when slow mode is on.

import { tone } from "./tinySynth";

const SCALE = [
  293.66, 329.63, 369.99, 440, 493.88, 587.33, 659.25, 739.99, 880, 987.77,
];
const BEAT_MS = 560;
const STEPS = [-2, -1, -1, 1, 1, 2];

let timer = null;
let step = 4;
let beat = 0;

const isSlow = () =>
  document.documentElement.classList.contains("slow-mode");

function play() {
  if (Math.random() > 0.18) {
    const move = STEPS[Math.floor(Math.random() * STEPS.length)];
    step = Math.min(SCALE.length - 1, Math.max(0, step + move));
    // a hair of detune so it sounds plucked by hand
    const freq = SCALE[step] * (1 + (Math.random() - 0.5) * 0.004);
    tone(0, { freq, dur: 1.4, peak: 0.018, filter: 2400 });
    tone(0, { freq: freq * 2, dur: 0.5, peak: 0.004 });
  }
  if (beat % 8 === 0) {
    tone(0, { freq: SCALE[0] / 2, dur: 3.5, peak: 0.012, type: "triangle", filter: 600 });
  }
  beat++;
  timer = setTimeout(play, BEAT_MS * (isSlow() ? 2.5 : 1));
}

export const musicPlaying = () => timer !== null;

export function startMusic() {
  if (timer) return;
  // every press starts fresh from the middle of the scale
  step = 4;
  beat = 0;
  play();
}

export function stopMusic() {
  clearTimeout(timer);
  timer = null;
}
