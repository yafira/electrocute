// a very quiet electrical hum for the sewn circuit in the nav.
// starts the moment the switch closes and the thread starts flowing,
// fades out the moment it opens. meant to sit just below the
// threshold of noticing, the way a breadboard hums faintly under a
// lamp — this is the one sound in the lab that loops instead of
// playing once, so it's kept much quieter than a press or a click.

let ctx = null;
let nodes = null;

function getCtx() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function startCircuitBuzz() {
  try {
    const audioCtx = getCtx();
    if (nodes) return; // already humming, nothing to do

    const now = audioCtx.currentTime;
    const baseLevel = 0.009;

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(baseLevel, now + 0.5);
    masterGain.connect(audioCtx.destination);

    // two close, slightly detuned tones beating against each other,
    // like current humming through a thin conductive thread
    const oscA = audioCtx.createOscillator();
    oscA.type = "sawtooth";
    oscA.frequency.value = 58;

    const oscB = audioCtx.createOscillator();
    oscB.type = "sawtooth";
    oscB.frequency.value = 61.5;

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 220;
    filter.Q.value = 0.7;

    const oscGain = audioCtx.createGain();
    oscGain.gain.value = 0.5;

    // a slow tremolo, like the connection flickers ever so slightly
    const tremolo = audioCtx.createOscillator();
    tremolo.type = "sine";
    tremolo.frequency.value = 5.5;
    const tremoloDepth = audioCtx.createGain();
    tremoloDepth.gain.value = baseLevel * 0.3;
    tremolo.connect(tremoloDepth);
    tremoloDepth.connect(masterGain.gain);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(masterGain);

    oscA.start(now);
    oscB.start(now);
    tremolo.start(now);

    nodes = { masterGain, oscA, oscB, tremolo };
  } catch (e) {
    // audio is a garnish; never let it break the switch
  }
}

export function stopCircuitBuzz() {
  try {
    if (!nodes || !ctx) return;
    const now = ctx.currentTime;
    const { masterGain, oscA, oscB, tremolo } = nodes;

    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    oscA.stop(now + 0.4);
    oscB.stop(now + 0.4);
    tremolo.stop(now + 0.4);

    nodes = null;
  } catch (e) {
    // same here — fail quiet, not loud
  }
}
