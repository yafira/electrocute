import { useState, useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";
import { DIAL_EVENT, dialAmbience } from "./SoftPot";

let audioCtx = null;

function getCtx() {
  audioCtx =
    audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// one little note, the building block every trinket voice is made of.
// short and plucky, detuned in pitch rather than volume so a whole
// scene of notes still sounds handmade instead of sequenced.
function pluck(
  ctx,
  start,
  {
    freq,
    to = freq,
    dur = 0.1,
    peak = 0.05,
    type = "sine",
    filterType = "lowpass",
    filterFreq = 3000,
    filterQ = 1,
  },
) {
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to !== freq) osc.frequency.exponentialRampToValueAtTime(to, t + dur);

  filter.type = filterType;
  filter.frequency.value = filterFreq;
  filter.Q.value = filterQ;

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.012, dur * 0.25));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// a pinch of white noise, reused for every spark
let noiseBuffer = null;
function getNoise(ctx) {
  if (noiseBuffer) return noiseBuffer;
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}

// a scatter of tiny sparks: very short noise ticks at random moments,
// each through its own bright bandpass so they snap and pop like an arc
function crackle(ctx, start, { dur = 0.3, count = 14, peak = 0.08 }) {
  const noise = getNoise(ctx);
  for (let i = 0; i < count; i++) {
    const t = ctx.currentTime + start + Math.random() * dur;
    const len = 0.004 + Math.random() * 0.018;
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    src.buffer = noise;
    filter.type = "bandpass";
    filter.frequency.value = 1800 + Math.random() * 5000;
    filter.Q.value = 1.5;

    const level = peak * (0.35 + Math.random() * 0.65);
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + len);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t, Math.random() * 0.5, len + 0.01);
  }
}

// the buzz of current itself: a gritty sawtooth hum that wobbles fast,
// swept in pitch so it can surge up or sag away
function bzzt(ctx, start, { freq, to = freq, dur = 0.3, peak = 0.04 }) {
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const wobble = ctx.createOscillator();
  const wobbleDepth = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur);

  // a fast irregular wobble on the pitch is what makes it fizz
  wobble.type = "square";
  wobble.frequency.value = 37;
  wobbleDepth.gain.value = freq * 0.25;
  wobble.connect(wobbleDepth);
  wobbleDepth.connect(osc.frequency);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, t);
  filter.frequency.exponentialRampToValueAtTime(2400, t + dur);
  filter.Q.value = 0.9;

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.02);
  gain.gain.setValueAtTime(peak, t + dur * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  wobble.start(t);
  osc.stop(t + dur + 0.02);
  wobble.stop(t + dur + 0.02);
}

export function playSynthSound(type) {
  try {
    const ctx = getCtx();

    if (type === "neon-on" || type === "neon-off") {
      // a neon sign: a relay click and a ballast hum (stuttering as it
      // catches when switching on), then the old two-blip beep after
      const on = type === "neon-on";
      crackle(ctx, 0, { dur: 0.01, count: 2, peak: 0.15 });
      if (on) {
        [0.03, 0.11, 0.16, 0.27].forEach((d, i) =>
          bzzt(ctx, d, { freq: 120, dur: i === 3 ? 0.5 : 0.05, peak: 0.03 }),
        );
        crackle(ctx, 0.03, { dur: 0.3, count: 5, peak: 0.04 });
      } else {
        bzzt(ctx, 0.01, { freq: 120, to: 90, dur: 0.15, peak: 0.025 });
      }
      const beep = on ? 0.8 : 0.2;
      pluck(ctx, beep, {
        freq: 740,
        to: 880,
        dur: 0.05,
        peak: 0.03,
        type: "square",
        filterFreq: 2200,
      });
      pluck(ctx, beep + 0.07, {
        freq: 990,
        dur: 0.09,
        peak: 0.024,
        type: "square",
        filterFreq: 1800,
      });
    } else if (type === "led") {
      // a firefly blinking on: two quick notes hopping upward
      pluck(ctx, 0, {
        freq: 660,
        to: 880,
        dur: 0.08,
        peak: 0.05,
        type: "sine",
        filterFreq: 4000,
      });
      pluck(ctx, 0.05, {
        freq: 990,
        to: 1318.51,
        dur: 0.14,
        peak: 0.035,
        type: "sine",
        filterFreq: 5000,
      });
    } else if (type === "knob") {
      // a little musical ratchet: a click with a bright tick riding on top
      pluck(ctx, 0, {
        freq: 220,
        to: 160,
        dur: 0.05,
        peak: 0.1,
        type: "triangle",
        filterType: "bandpass",
        filterFreq: 500,
        filterQ: 4,
      });
      pluck(ctx, 0.015, {
        freq: 1046.5,
        dur: 0.03,
        peak: 0.02,
        type: "square",
        filterFreq: 3500,
      });
    } else if (type === "resistor") {
      // a sparkly little arpeggio, like a new color chip landing in place
      [523.25, 659.25, 783.99].forEach((f, i) => {
        pluck(ctx, i * 0.04, {
          freq: f,
          to: f * 1.02,
          dur: 0.1,
          peak: 0.032,
          type: "triangle",
          filterType: "highpass",
          filterFreq: 500,
        });
      });
    } else if (type === "terminal") {
      // a soft two-blip chirp, like a message arriving on the wire
      pluck(ctx, 0, {
        freq: 740,
        to: 880,
        dur: 0.05,
        peak: 0.03,
        type: "square",
        filterFreq: 2200,
      });
      pluck(ctx, 0.07, {
        freq: 990,
        dur: 0.09,
        peak: 0.024,
        type: "square",
        filterFreq: 1800,
      });
    } else if (type === "chip") {
      // the chip-bug getting startled: a quick warble up, then a skitter down
      pluck(ctx, 0, {
        freq: 280,
        to: 900,
        dur: 0.05,
        peak: 0.035,
        type: "square",
        filterFreq: 2600,
      });
      pluck(ctx, 0.05, {
        freq: 780,
        to: 180,
        dur: 0.09,
        peak: 0.028,
        type: "square",
        filterFreq: 2000,
      });
    } else if (type === "toggle-on") {
      // a satisfying clunk, then a little chime as the circuit wakes up
      pluck(ctx, 0, {
        freq: 90,
        to: 130,
        dur: 0.06,
        peak: 0.12,
        type: "square",
        filterFreq: 500,
        filterQ: 2,
      });
      pluck(ctx, 0.03, {
        freq: 523.25,
        dur: 0.1,
        peak: 0.03,
        type: "sine",
        filterFreq: 3000,
      });
      pluck(ctx, 0.08, {
        freq: 783.99,
        dur: 0.16,
        peak: 0.024,
        type: "sine",
        filterFreq: 3500,
      });
    } else if (type === "toggle-off") {
      // the same clunk, settling downward instead of chiming up
      pluck(ctx, 0, {
        freq: 100,
        to: 60,
        dur: 0.07,
        peak: 0.12,
        type: "square",
        filterFreq: 500,
        filterQ: 2,
      });
      pluck(ctx, 0.03, {
        freq: 392,
        to: 262,
        dur: 0.14,
        peak: 0.026,
        type: "sine",
        filterFreq: 2000,
      });
    } else if (type === "scope") {
      // flipping to a new waveform: a quick curious little sweep
      pluck(ctx, 0, {
        freq: 420,
        to: 1100,
        dur: 0.11,
        peak: 0.03,
        type: "sine",
        filterFreq: 4200,
      });
      pluck(ctx, 0.09, {
        freq: 1100,
        to: 700,
        dur: 0.06,
        peak: 0.018,
        type: "sine",
        filterFreq: 4200,
      });
    }
  } catch (e) {}
}

export function trinketStyle(x, y, rot = 0, isMobile = false) {
  if (isMobile) {
    return {
      position: "relative",
      left: "auto",
      top: "auto",
      transform: `rotate(${rot}deg)`,
      zIndex: 50,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "50px",
      height: "50px",
      background: "none",
      border: "none",
      padding: 0,
    };
  }
  return {
    position: "absolute",
    left: x,
    top: y,
    transform: `translate(-50%, -50%) rotate(${rot}deg)`,
    zIndex: 50,
  };
}

export function ToggleTrinket({ x, y, rot, active, onToggle, isMobile }) {
  const activeTrackStyle = active
    ? { background: "#decffc", borderColor: "#beb0eb" }
    : {};

  const styleSetting = isMobile
    ? {
        position: "relative",
        left: "auto",
        top: "auto",
        transform: "none",
        display: "inline-block",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
      }
    : trinketStyle(x, y, rot, isMobile);

  return (
    <button
      type="button"
      className={styles.miniToggleTrinket}
      style={styleSetting}
      onClick={() => {
        playSynthSound(active ? "toggle-off" : "toggle-on");
        if (onToggle) onToggle();
      }}
      aria-pressed={active}
      aria-label="oscilloscope power switch"
    >
      <span
        className={`${styles.miniSwitchTrack} ${active ? styles.miniSwitchOn : ""}`}
        style={activeTrackStyle}
      >
        <span className={styles.miniSwitchThumb} />
      </span>
    </button>
  );
}

export function KnobTrinket({ x, y, rot, onTurn, isMobile }) {
  const [turns, setTurns] = useState(0);
  return (
    <button
      type="button"
      className={styles.trinket}
      style={trinketStyle(x, y, rot, isMobile)}
      onClick={() => {
        playSynthSound("knob");
        const nextTurns = turns + 1;
        setTurns(nextTurns);
        if (onTurn) onTurn(nextTurns);
      }}
      aria-label="interactive knob"
    >
      <span
        className={styles.knob}
        style={isMobile ? { display: "block", position: "relative" } : {}}
      >
        <span
          className={styles.knobFace}
          style={{ transform: `rotate(${turns * 45}deg)` }}
        />
      </span>
    </button>
  );
}

const RESISTOR_PALETTES = [
  ["#f2b9e0", "#9d96e7", "#94f1d3", "#f0d264"],
  ["#94f1d3", "#f0d264", "#f2b9e0", "#9d96e7"],
  ["#9d96e7", "#94f1d3", "#f0d264", "#f2b9e0"],
  ["#f0d264", "#f2b9e0", "#9d96e7", "#94f1d3"],
];

export function ResistorTrinket({ x, y, rot, isMobile }) {
  const [i, setI] = useState(0);
  const bands = RESISTOR_PALETTES[i % RESISTOR_PALETTES.length];
  return (
    <button
      type="button"
      className={styles.trinket}
      style={trinketStyle(x, y, rot, isMobile)}
      onClick={() => {
        playSynthSound("resistor");
        setI(i + 1);
      }}
      aria-label="decorative resistor"
    >
      <span className={styles.resistor}>
        {bands.map((color, b) => (
          <span
            key={b}
            className={styles.resistorBand}
            style={{ background: color }}
          />
        ))}
      </span>
    </button>
  );
}

const TERM_MESSAGES = ["3.3v ok", "hello, world", "stitching...", "soft: on"];

// the sailor moon calculator, shrunk down to a little handheld on the
// bench. clicking it opens the real one in the floating window
const CALC_KEYS = Array.from({ length: 12 }, (_, i) => i);

export function CalcTrinket({ x, y, rot, isMobile, onOpen }) {
  return (
    <button
      type="button"
      className={styles.trinket}
      style={trinketStyle(x, y, rot, isMobile)}
      onClick={() => {
        playSynthSound("chip");
        onOpen?.();
      }}
      aria-label="open the sailor moon calculator"
      title="sailor moon calculator"
    >
      <svg
        className={styles.calcTrinket}
        width={isMobile ? 46 : 74}
        height={isMobile ? 64 : 103}
        viewBox="0 0 46 64"
        aria-hidden="true"
      >
        {/* body */}
        <rect
          x="2"
          y="2"
          width="42"
          height="60"
          rx="12"
          fill="#fcd9ec"
          stroke="#e88fc9"
          strokeWidth="1.5"
        />
        {/* little crescent up top */}
        <path
          d="M23 6.5 a3.6 3.6 0 1 0 3.2 5.4 a2.8 2.8 0 1 1 -3.2 -5.4 z"
          fill="#f0d264"
        />
        {/* screen */}
        <rect
          x="8"
          y="15"
          width="30"
          height="11"
          rx="3"
          fill="#efeaff"
          stroke="#c9bdf2"
          strokeWidth="1"
        />
        <text x="34.5" y="23.5" className={styles.calcDigits} textAnchor="end">
          0.
        </text>
        {/* keys */}
        {CALC_KEYS.map((k) => (
          <circle
            key={k}
            cx={12 + (k % 3) * 11}
            cy={33 + Math.floor(k / 3) * 7.4}
            r="2.7"
            fill={k === 11 ? "#f2b9e0" : "#ffffff"}
            stroke="#e7b3d3"
            strokeWidth="0.8"
          />
        ))}
      </svg>
    </button>
  );
}

export function TermTrinket({ x, y, rot, isMobile }) {
  const [i, setI] = useState(0);

  const styleSetting = isMobile
    ? {
        position: "relative",
        left: "auto",
        top: "auto",
        transform: "none",
        display: "inline-flex",
        background: "none",
        border: "none",
        padding: 0,
      }
    : trinketStyle(x, y, rot, isMobile);

  return (
    <button
      type="button"
      className={styles.trinket}
      style={styleSetting}
      onClick={() => {
        playSynthSound("terminal");
        setI(i + 1);
      }}
      aria-label="decorative terminal"
    >
      <span className={styles.termChip}>
        {TERM_MESSAGES[i % TERM_MESSAGES.length]}
        <span className={styles.termCursor} />
      </span>
    </button>
  );
}

export function StitchTrinket({ x, y, rot, isMobile }) {
  if (isMobile) return null;
  return (
    <span
      className={styles.trinket}
      style={trinketStyle(x, y, rot, isMobile)}
      aria-hidden="true"
    >
      <svg width="100" height="12" viewBox="0 0 100 12">
        <line x1="2" y1="6" x2="98" y2="6" className={styles.stitchLine} />
      </svg>
    </span>
  );
}

export function ScopeTrinket({ x, y, rot, isPowered, scale = 1, isMobile }) {
  const [mode, setMode] = useState(0);
  const totalModes = 5;

  const handleScopeClick = () => {
    playSynthSound("scope");
    setMode((prev) => (prev + 1) % totalModes);
  };

  const styleSetting = isMobile
    ? {
        position: "relative",
        left: "auto",
        top: "auto",
        transform: "scale(0.85)",
        zIndex: 50,
        background: "none",
        border: "none",
        padding: 0,
      }
    : trinketStyle(x, y, rot, isMobile);

  return (
    <button
      type="button"
      className={styles.scopeTrinketLarge}
      style={styleSetting}
      onClick={handleScopeClick}
      aria-label="interactive cute oscilloscope"
    >
      <span className={styles.scopeLarge}>
        <svg
          className={styles.scopeSvgLarge}
          width="288"
          height="70"
          viewBox="0 0 288 70"
          style={{ animationPlayState: isPowered ? "running" : "paused" }}
        >
          <g
            transform={`translate(0, 35) scale(1, ${scale}) translate(0, -35)`}
          >
            {mode === 0 && (
              <path
                d="M0,35 Q18,3 36,35 T72,35 T108,35 T144,35 T180,35 T216,35 T252,35 T288,35"
                className={styles.scopeWaveLarge}
              />
            )}
            {mode === 1 && (
              <path
                d="M0,15 H36 V55 H72 V15 H108 V55 H144 V15 H180 V55 H216 V15 H252 V55 H288"
                className={styles.scopeWaveLarge}
              />
            )}
            {mode === 2 && (
              <path
                d="M0,35 L18,8 L54,62 L90,8 L126,62 L162,8 L198,62 L234,8 L270,62 L288,35"
                className={styles.scopeWaveLarge}
              />
            )}
            {mode === 3 && (
              <g
                className={styles.scopeWaveLarge}
                style={{ fill: "none", strokeWidth: 2 }}
              >
                {[0, 60, 120, 180, 240, 300].map((offsetX) => (
                  <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
                    <path d="M 0,35 Q 15,20 30,35 T 60,35" />
                    <circle cx="30" cy="35" r="5" style={{ fill: "#94f1d3" }} />
                    <circle cx="24" cy="35" r="3" />
                    <circle cx="36" cy="35" r="3" />
                    <circle cx="30" cy="29" r="3" />
                    <circle cx="30" cy="41" r="3" />
                  </g>
                ))}
              </g>
            )}
            {mode === 4 && (
              <g className={styles.scopeWaveLarge}>
                <path
                  d="M0,45 Q36,15 72,45 T144,45 T216,45 T288,45"
                  fill="none"
                />
                {[36, 108, 180, 252].map((cx, idx) => (
                  <path
                    key={idx}
                    d={`M ${cx},20 L ${cx + 3},25 L ${cx + 9},25 L ${cx + 4},29 L ${cx + 6},35 L ${cx},31 L ${cx - 6},35 L ${cx - 4},29 L ${cx - 9},25 L ${cx - 3},25 Z`}
                    style={{ fill: "#94f1d3", strokeWidth: 1 }}
                  />
                ))}
              </g>
            )}
          </g>
        </svg>
      </span>
    </button>
  );
}

// a little wandering 555 chip-bug — hops between spots in its bounds,
// pauses to look around when it arrives, and leaves a little sparkle
// trail while walking. clicking startles it: it beeps and skitters
// to a new spot immediately.
export function ChipTrinket({
  boundsX = [12, 86],
  boundsY = [84, 95],
  isMobile,
}) {
  const [pos, setPos] = useState({
    x: (boundsX[0] + boundsX[1]) / 2,
    y: (boundsY[0] + boundsY[1]) / 2,
  });
  const [facing, setFacing] = useState(1); // 1 = facing right, -1 = facing left
  const [walking, setWalking] = useState(false);
  const [startled, setStartled] = useState(false);
  const [looking, setLooking] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const dropSparkle = (x, y) => {
    const id = Math.random().toString(36).slice(2);
    setSparkles((prev) => [...prev, { id, x, y }].slice(-6));
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 900);
  };

  const wander = () => {
    setPos((prev) => {
      const x = boundsX[0] + Math.random() * (boundsX[1] - boundsX[0]);
      const y = boundsY[0] + Math.random() * (boundsY[1] - boundsY[0]);
      setFacing(x < prev.x ? -1 : 1);

      dropSparkle(prev.x, prev.y);
      setTimeout(() => dropSparkle((prev.x + x) / 2, (prev.y + y) / 2), 400);

      return { x, y };
    });
    setWalking(true);
    setLooking(false);
    setTimeout(() => {
      setWalking(false);
      if (Math.random() < 0.7) {
        setLooking(true);
        setTimeout(() => setLooking(false), 1100);
      }
    }, 3000);
  };

  useEffect(() => {
    if (isMobile) return;
    let cancelled = false;
    const timeoutRef = { current: null };
    const tick = () => {
      if (cancelled) return;
      wander();
      const delay = 5000 + Math.random() * 4000;
      timeoutRef.current = setTimeout(tick, delay);
    };
    timeoutRef.current = setTimeout(tick, 1800);
    return () => {
      cancelled = true;
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  if (isMobile) return null;

  const handleClick = () => {
    playSynthSound("chip");
    setStartled(true);
    wander();
    setTimeout(() => setStartled(false), 500);
  };

  return (
    <>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={styles.chipSparkle}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            zIndex: 49,
          }}
          aria-hidden="true"
        />
      ))}

      <button
        type="button"
        className={styles.chipTrinket}
        onClick={handleClick}
        aria-label="a small wandering 555 timer chip"
        style={{
          position: "absolute",
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: `translate(-50%, -50%) scaleX(${facing}) ${
            startled ? "rotate(-8deg) scale(1.15)" : ""
          }`,
          transition:
            "left 3s cubic-bezier(0.65, -0.15, 0.35, 1.15), top 3s cubic-bezier(0.65, -0.15, 0.35, 1.15), transform 0.25s ease",
          zIndex: 50,
        }}
      >
        <span
          className={`${styles.chipBody} ${walking ? styles.chipWalking : ""} ${
            looking ? styles.chipLooking : ""
          }`}
        >
          <svg
            viewBox="0 0 100 60"
            width="58"
            height="35"
            className={styles.chipSvg}
          >
            <g className={styles.chipLegsTop}>
              <rect x="22.5" y="1" width="4" height="15" />
              <rect x="39.5" y="1" width="4" height="15" />
              <rect x="56.5" y="1" width="4" height="15" />
              <rect x="73.5" y="1" width="4" height="15" />
            </g>
            <g className={styles.chipLegsBottom}>
              <rect x="22.5" y="44" width="4" height="15" />
              <rect x="39.5" y="44" width="4" height="15" />
              <rect x="56.5" y="44" width="4" height="15" />
              <rect x="73.5" y="44" width="4" height="15" />
            </g>

            <rect
              x="16"
              y="16"
              width="68"
              height="28"
              rx="3"
              className={styles.chipFront}
            />

            <g className={styles.chipFlowerBig} transform="translate(33,30)">
              <circle cx="0" cy="-4" r="3.4" />
              <circle cx="4.2" cy="-1.3" r="3.4" />
              <circle cx="2.6" cy="3.8" r="3.4" />
              <circle cx="-2.6" cy="3.8" r="3.4" />
              <circle cx="-4.2" cy="-1.3" r="3.4" />
              <circle
                cx="0"
                cy="0"
                r="2.1"
                className={styles.chipFlowerCenter}
              />
            </g>
            <g className={styles.chipFlowerSmall} transform="translate(50,33)">
              <circle cx="0" cy="-2.2" r="1.8" />
              <circle cx="2.2" cy="-0.7" r="1.8" />
              <circle cx="1.3" cy="1.9" r="1.8" />
              <circle cx="-1.3" cy="1.9" r="1.8" />
              <circle cx="-2.2" cy="-0.7" r="1.8" />
            </g>

            <text x="66" y="36" className={styles.chip555}>
              555
            </text>
          </svg>
        </span>
      </button>
    </>
  );
}

// portrait mini breadboard — narrow like the real thing, with the led
// seated in the left terminal strip and a tactile button straddling
// the center channel. its four legs go into the holes on rows 6 and 7,
// one pair on each side of the channel. pressing the button toggles the led on/off.
export function BreadboardTrinket({
  x = "76%",
  y = "-10%",
  rot = -4,
  isMobile,
  ledOn,
  circuitOn = false,
  onButtonPress,
}) {
  const [litHole, setLitHole] = useState(null);
  const [pressAnim, setPressAnim] = useState(false);
  // where the breadboard's pot is turned, 0 to 1, matching the site's dial
  const [dial, setDial] = useState(0);
  useEffect(() => {
    const saved = parseFloat(localStorage.getItem("electrocute:softpot"));
    if (Number.isFinite(saved)) setDial(saved);
    const onDial = (event) => setDial(event.detail);
    window.addEventListener(DIAL_EVENT, onDial);
    return () => window.removeEventListener(DIAL_EVENT, onDial);
  }, []);

  // dragging the pot's knob turns the dial. it goes through dialAmbience,
  // so it only moves while the circuit is on, and the slider follows
  const potSvg = useRef(null);
  const potDrag = useRef(false);
  const turnPot = (e) => {
    const svg = potSvg.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    // knob center in svg units is (68, 147.5)
    const cx = r.left + (68 / 96) * r.width;
    const cy = r.top + (147.5 / 200) * r.height;
    const angle = Math.atan2(e.clientX - cx, -(e.clientY - cy)) * (180 / Math.PI);
    const clamped = Math.max(-135, Math.min(135, angle));
    dialAmbience(((clamped + 135) / 270) * 1023);
  };

  if (isMobile) return null;

  const LEFT_COLS = [10, 19, 28, 37];
  const RIGHT_COLS = [59, 68, 77, 86];
  const ROWS = 14;
  const rowY = (r) => 14 + r * 13;

  // the board itself is silent, only the button makes a sound
  const handleBoardClick = () => {
    const side = Math.random() < 0.5 ? "L" : "R";
    const col = Math.floor(Math.random() * 4);
    const row = Math.floor(Math.random() * ROWS);
    setLitHole(`${side}-${col}-${row}`);
    setTimeout(() => setLitHole(null), 700);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    // nothing happens, no sound or press, until the header switch is on
    if (!circuitOn) return;
    // the led is about to flip, so the sound matches where it's going
    playSynthSound(ledOn ? "neon-off" : "neon-on");
    setPressAnim(true);
    setTimeout(() => setPressAnim(false), 150);
    if (onButtonPress) onButtonPress();
  };

  return (
    <div
      className={styles.breadboardTrinket}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rot}deg)`,
        zIndex: 3,
      }}
    >
      <svg
        width="96"
        height="200"
        viewBox="0 0 96 200"
        ref={potSvg}
        onPointerMove={(e) => {
          if (potDrag.current) turnPot(e);
        }}
        onPointerUp={() => {
          potDrag.current = false;
        }}
        onPointerLeave={() => {
          potDrag.current = false;
        }}
        className={styles.breadboardSvg}
        shapeRendering="geometricPrecision"
      >
        <g
          className={styles.boardClickable}
          onClick={handleBoardClick}
          aria-label="decorative mini breadboard"
        >
          <rect
            x="2"
            y="2"
            width="92"
            height="196"
            rx="6"
            className={styles.breadboardBody}
          />

          <rect
            x="42"
            y="8"
            width="12"
            height="184"
            className={styles.channel}
          />

          {LEFT_COLS.map((cx, c) =>
            Array.from({ length: ROWS }).map((_, r) => {
              const key = `L-${c}-${r}`;
              return (
                <circle
                  key={key}
                  cx={cx}
                  cy={rowY(r)}
                  r="1.4"
                  className={`${styles.hole} ${litHole === key ? styles.holeLit : ""}`}
                />
              );
            }),
          )}

          {RIGHT_COLS.map((cx, c) =>
            Array.from({ length: ROWS }).map((_, r) => {
              const key = `R-${c}-${r}`;
              return (
                <circle
                  key={key}
                  cx={cx}
                  cy={rowY(r)}
                  r="1.4"
                  className={`${styles.hole} ${litHole === key ? styles.holeLit : ""}`}
                  // the top right hole is where the logo's power cable plugs in
                  data-power-hole={key === "R-3-0" ? "" : undefined}
                />
              );
            }),
          )}
        </g>

        <g aria-hidden="true" pointerEvents="none">
          <circle
            cx="23.5"
            cy="12"
            r="14"
            className={`${styles.bbLedGlow} ${ledOn ? styles.bbLedGlowOn : ""}`}
          />
          <rect
            x="18.3"
            y="20"
            width="1.4"
            height="7.5"
            className={styles.bbLedLeg}
          />
          <rect
            x="27.3"
            y="20"
            width="1.4"
            height="7.5"
            className={styles.bbLedLeg}
          />
          <rect
            x="16"
            y="17.5"
            width="15"
            height="4"
            rx="2"
            className={styles.bbLedRim}
          />
          <circle
            cx="23.5"
            cy="12.5"
            r="7"
            className={`${styles.bbLedDome} ${ledOn ? styles.bbLedDomeOn : ""}`}
          />
        </g>

        <g
          className={styles.pushButtonGroup}
          onClick={handleButtonClick}
          aria-label="push button that toggles the led"
        >
          <rect
            x="37"
            y="90.7"
            width="3.1"
            height="2.6"
            className={styles.pushButtonPin}
          />
          <rect
            x="37"
            y="103.7"
            width="3.1"
            height="2.6"
            className={styles.pushButtonPin}
          />
          <rect
            x="55.9"
            y="90.7"
            width="3.1"
            height="2.6"
            className={styles.pushButtonPin}
          />
          <rect
            x="55.9"
            y="103.7"
            width="3.1"
            height="2.6"
            className={styles.pushButtonPin}
          />

          <rect
            x="40"
            y="91"
            width="16"
            height="16"
            rx="3"
            className={styles.pushButtonHousing}
          />

          <circle cx="43" cy="95" r="1.2" className={styles.pushButtonRivet} />
          <circle cx="53" cy="95" r="1.2" className={styles.pushButtonRivet} />
          <circle cx="43" cy="104" r="1.2" className={styles.pushButtonRivet} />
          <circle cx="53" cy="104" r="1.2" className={styles.pushButtonRivet} />

          <circle
            cx="48"
            cy="99"
            r="5.5"
            className={`${styles.pushButtonCap} ${
              pressAnim ? styles.pushButtonCapPressed : ""
            }`}
          />
        </g>

        {/* silver rotary pot, seen from above like the reference: a large dark
            body with tick marks, a blue knob, and a pointer that turns with
            the dial (-135 to 135 degrees). three short legs drop into the
            holes in row 12, the middle one under the body's center */}
        <g aria-hidden="true" pointerEvents="none" transform="translate(0 26)">
          {[59, 68, 77].map((x) => (
            <rect
              key={`leg-${x}`}
              x={x - 0.6}
              y="132"
              width="1.2"
              height="12"
              fill="#9aa3ad"
            />
          ))}
          <circle cx="68" cy="121.5" r="14.5" fill="#5d6470" />
          <circle
            cx="68"
            cy="121.5"
            r="12.6"
            fill="none"
            stroke="#c9ced8"
            strokeWidth="2.2"
            strokeDasharray="0.5 0.7"
          />
          <circle cx="68" cy="121.5" r="10.4" fill="#b9bfca" />
          <line
            x1="68"
            y1="121.5"
            x2="68"
            y2="113.5"
            stroke="#3a3f4a"
            strokeWidth="2.6"
            strokeLinecap="round"
            transform={`rotate(${-135 + dial * 270} 68 121.5)`}
          />
        </g>
        {/* invisible knob hit area so the pot can be turned */}
        <circle
          cx="68"
          cy="147.5"
          r="14.5"
          fill="transparent"
          style={{ cursor: "grab" }}
          onPointerDown={(e) => {
            potDrag.current = true;
            e.currentTarget.ownerSVGElement.setPointerCapture(e.pointerId);
            turnPot(e);
          }}
        />
      </svg>
    </div>
  );
}

// standalone led trinket — still used in the mobile interactive bench.
// it manages its own on/off state when no `on`/`onToggle` props are
// passed (which also fixes the crash the mobile bench had before,
// where clicking called an undefined onToggle).
export function LedTrinket({ x, y, rot, isMobile, on, onToggle }) {
  const [selfOn, setSelfOn] = useState(false);
  const isOn = typeof on === "boolean" ? on : selfOn;

  return (
    <button
      type="button"
      className={styles.trinket}
      style={trinketStyle(x, y, rot, isMobile)}
      onClick={() => {
        playSynthSound("led");
        if (onToggle) {
          onToggle();
        } else {
          setSelfOn((v) => !v);
        }
      }}
      aria-pressed={isOn}
      aria-label="decorative led"
    >
      <span className={`${styles.ledDot} ${isOn ? styles.ledOn : ""}`} />
    </button>
  );
}
