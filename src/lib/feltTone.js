// the lab's soft press tone, shared by anything squishy.
// a sine two-note with gentle detune so repeated presses
// sound handmade rather than sampled.

let audioCtx = null;

export function playFeltTone(baseFreq) {
  try {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();

    const now = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    gain.connect(audioCtx.destination);

    const base = (baseFreq || 440) + Math.random() * 60;
    [base, base * 1.5].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.94, now + 0.28);
      const partGain = audioCtx.createGain();
      partGain.gain.value = i === 0 ? 1 : 0.35;
      osc.connect(partGain).connect(gain);
      osc.start(now);
      osc.stop(now + 0.3);
    });

    // a tiny grace note just ahead of the main tone, like a little
    // intake of breath before the press settles in
    const graceGain = audioCtx.createGain();
    graceGain.gain.setValueAtTime(0.0001, now);
    graceGain.gain.exponentialRampToValueAtTime(0.035, now + 0.006);
    graceGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    graceGain.connect(audioCtx.destination);

    const grace = audioCtx.createOscillator();
    grace.type = "sine";
    grace.frequency.setValueAtTime(base * 2.2, now);
    grace.frequency.exponentialRampToValueAtTime(base * 1.9, now + 0.05);
    grace.connect(graceGain);
    grace.start(now);
    grace.stop(now + 0.06);
  } catch {
    // audio is a garnish; never let it break a button
  }
}
