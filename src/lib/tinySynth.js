// two small web audio voices for the newer trinkets (modem, moth,
// fortune chip, punchi): a shaped tone and a burst of filtered noise.
// everything is scheduled relative to "now", so a whole little scene
// (a dial-up handshake, a printer chattering) is just a list of calls.

let ctx = null;
let noiseBuffer = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function tone(
  start,
  { freq, to = freq, dur = 0.1, peak = 0.03, type = "sine", filter = 4000 },
) {
  try {
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime + start;
    const osc = c.createOscillator();
    const lp = c.createBiquadFilter();
    const gain = c.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (to !== freq) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
    lp.frequency.value = filter;

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.012, dur * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  } catch {
    // sound is a nicety, never a reason to break the page
  }
}

export function noise(start, { dur = 0.1, peak = 0.03, band = 2000, q = 1 }) {
  try {
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime + start;
    if (!noiseBuffer) {
      noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    const src = c.createBufferSource();
    const bp = c.createBiquadFilter();
    const gain = c.createGain();

    src.buffer = noiseBuffer;
    bp.type = "bandpass";
    bp.frequency.value = band;
    bp.Q.value = q;
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(c.destination);
    src.start(t, Math.random() * 0.5, dur + 0.02);
  } catch {
    // same as above
  }
}
