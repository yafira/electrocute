import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import projects, { photoItems, resources } from "../data/projects";
import IframePanel, { openProject } from "./IframePanel";

const COLLAGE_ORDER = [
  { type: "card", slug: "electrocute-ui" },
  { type: "photo", slug: "petalbyte" },
  { type: "card", slug: "soft-interfaces" },
  { type: "photo", slug: "the-soft-computer" },
  { type: "photo", slug: "ribbon-logic" },
  { type: "card", slug: "neural-nectar" },
  { type: "card", slug: "kawaii-ml" },
  { type: "photo", slug: "moonpocket" },
  { type: "card", slug: "soft-circuit-library" },
  { type: "card", slug: "synthwave-chimes" },
  { type: "photo", slug: "pocket-oracle-of-time" },
  { type: "card", slug: "sailor-moon-calculator" },
  { type: "photo", slug: "puffcast" },
  { type: "photo", slug: "custom-light-leds" },
  { type: "photo", slug: "tendertronic" }, // ← new
  { type: "card", slug: "snax" },
  { type: "photo", slug: "electrojute" },
];

const CARDS_BY_SLUG = Object.fromEntries(projects.map((p) => [p.slug, p]));
const PHOTOS_BY_SLUG = Object.fromEntries(photoItems.map((p) => [p.slug, p]));

const SHAPE_CLASS = {
  wide: "spotWide",
  sticky: "spotSticky",
  pill: "spotPill",
};

let audioCtx = null;

function playSynthSound(type) {
  try {
    audioCtx =
      audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    if (type === "led") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
      filter.type = "lowpass";
      filter.frequency.value = 2000;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.04, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    } else if (type === "knob") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.setValueAtTime(40, t + 0.01);
      filter.type = "bandpass";
      filter.frequency.value = 400;
      filter.Q.value = 3;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
    } else if (type === "resistor") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(140, t + 0.08);
      filter.type = "highpass";
      filter.frequency.value = 800;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.03, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    } else if (type === "terminal") {
      osc.type = "square";
      osc.frequency.setValueAtTime(587.33, t);
      osc.frequency.setValueAtTime(880, t + 0.03);
      filter.type = "lowpass";
      filter.frequency.value = 1500;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.025, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    } else if (type === "chip") {
      osc.type = "square";
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.setValueAtTime(330, t + 0.04);
      osc.frequency.setValueAtTime(440, t + 0.08);
      filter.type = "lowpass";
      filter.frequency.value = 2500;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.03, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch (e) {}
}

function doodadStyle(x, y, rot = 0, isMobile = false) {
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

function ToggleDoodad({ x, y, rot, active, onToggle, isMobile }) {
  const activeTrackStyle = active
    ? { background: "#decffc", borderColor: "#beb0eb" }
    : {};

  const styleSetting = isMobile
    ? {
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
      }
    : doodadStyle(x, y, rot, isMobile);

  return (
    <button
      type="button"
      className={styles.miniToggleDoodad}
      style={styleSetting}
      onClick={onToggle}
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

function KnobDoodad({ x, y, rot, onTurn, isMobile }) {
  const [turns, setTurns] = useState(0);
  return (
    <button
      type="button"
      className={styles.doodad}
      style={doodadStyle(x, y, rot, isMobile)}
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

function ResistorDoodad({ x, y, rot, isMobile }) {
  const [i, setI] = useState(0);
  const bands = RESISTOR_PALETTES[i % RESISTOR_PALETTES.length];
  return (
    <button
      type="button"
      className={styles.doodad}
      style={doodadStyle(x, y, rot, isMobile)}
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

function TermDoodad({ x, y, rot, isMobile }) {
  const [i, setI] = useState(0);

  const styleSetting = isMobile
    ? {
        position: "relative",
        display: "inline-flex",
        background: "none",
        border: "none",
        padding: 0,
      }
    : doodadStyle(x, y, rot, isMobile);

  return (
    <button
      type="button"
      className={styles.doodad}
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

function StitchDoodad({ x, y, rot, isMobile }) {
  if (isMobile) return null;
  return (
    <span
      className={styles.doodad}
      style={doodadStyle(x, y, rot, isMobile)}
      aria-hidden="true"
    >
      <svg width="100" height="12" viewBox="0 0 100 12">
        <line x1="2" y1="6" x2="98" y2="6" className={styles.stitchLine} />
      </svg>
    </span>
  );
}

function ScopeDoodad({ x, y, rot, isPowered, scale = 1, isMobile }) {
  const [mode, setMode] = useState(0);
  const totalModes = 5;

  const handleScopeClick = () => {
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
    : doodadStyle(x, y, rot, isMobile);

  return (
    <button
      type="button"
      className={styles.scopeDoodadLarge}
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
function ChipDoodad({ boundsX = [12, 86], boundsY = [84, 95], isMobile }) {
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

      // drop a couple of sparkles along the way for a little trail
      dropSparkle(prev.x, prev.y);
      setTimeout(() => dropSparkle((prev.x + x) / 2, (prev.y + y) / 2), 400);

      return { x, y };
    });
    setWalking(true);
    setLooking(false);
    // walk duration is longer now so the hop cycle has room to play
    setTimeout(() => {
      setWalking(false);
      // little "look around" pause after arriving, most of the time
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
      // longer, more varied pauses between wanders
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
        className={styles.chipDoodad}
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
            {/* legs, top side */}
            <g className={styles.chipLegsTop}>
              <rect x="22.5" y="1" width="4" height="15" />
              <rect x="39.5" y="1" width="4" height="15" />
              <rect x="56.5" y="1" width="4" height="15" />
              <rect x="73.5" y="1" width="4" height="15" />
            </g>
            {/* legs, bottom side */}
            <g className={styles.chipLegsBottom}>
              <rect x="22.5" y="44" width="4" height="15" />
              <rect x="39.5" y="44" width="4" height="15" />
              <rect x="56.5" y="44" width="4" height="15" />
              <rect x="73.5" y="44" width="4" height="15" />
            </g>

            {/* chip body — flat rectangular block */}
            <rect
              x="16"
              y="16"
              width="68"
              height="28"
              rx="3"
              className={styles.chipFront}
            />

            {/* flower */}
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

            {/* subtle 555 print */}
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
// the center channel. pressing the button toggles the led on/off.
function BreadboardDoodad({
  x = "76%",
  y = "-10%",
  rot = -4,
  isMobile,
  ledOn,
  onButtonPress,
}) {
  const [litHole, setLitHole] = useState(null);
  const [pressAnim, setPressAnim] = useState(false);

  if (isMobile) return null;

  // portrait layout: two 4-column terminal strips with a vertical
  // center channel between them, like a real mini breadboard
  const LEFT_COLS = [10, 19, 28, 37];
  const RIGHT_COLS = [59, 68, 77, 86];
  const ROWS = 14;
  const rowY = (r) => 14 + r * 13;

  const handleBoardClick = () => {
    playSynthSound("led");
    const side = Math.random() < 0.5 ? "L" : "R";
    const col = Math.floor(Math.random() * 4);
    const row = Math.floor(Math.random() * ROWS);
    setLitHole(`${side}-${col}-${row}`);
    setTimeout(() => setLitHole(null), 700);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    playSynthSound("terminal");
    setPressAnim(true);
    setTimeout(() => setPressAnim(false), 150);
    if (onButtonPress) onButtonPress();
  };

  return (
    <div
      className={styles.breadboardDoodad}
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
        className={styles.breadboardSvg}
        shapeRendering="geometricPrecision"
      >
        {/* board — clicking anywhere on it (except the button) lights a random hole */}
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

          {/* vertical center channel */}
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
                />
              );
            }),
          )}
        </g>

        {/* led — legs seated in two holes on the left strip */}
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

        {/* push button — straddles the center channel like a real tactile
            switch. coordinates are baked in (no transform attribute) so
            css hover transforms can't move it */}
        <g
          className={styles.pushButtonGroup}
          onClick={handleButtonClick}
          aria-label="push button that toggles the led"
        >
          {/* side pins */}
          <rect
            x="26"
            y="98"
            width="8"
            height="2.6"
            className={styles.pushButtonPin}
          />
          <rect
            x="26"
            y="113"
            width="8"
            height="2.6"
            className={styles.pushButtonPin}
          />
          <rect
            x="62"
            y="98"
            width="8"
            height="2.6"
            className={styles.pushButtonPin}
          />
          <rect
            x="62"
            y="113"
            width="8"
            height="2.6"
            className={styles.pushButtonPin}
          />

          {/* black housing */}
          <rect
            x="34"
            y="92"
            width="28"
            height="30"
            rx="3"
            className={styles.pushButtonHousing}
          />

          {/* corner rivets */}
          <circle cx="39" cy="97" r="1.6" className={styles.pushButtonRivet} />
          <circle cx="57" cy="97" r="1.6" className={styles.pushButtonRivet} />
          <circle cx="39" cy="117" r="1.6" className={styles.pushButtonRivet} />
          <circle cx="57" cy="117" r="1.6" className={styles.pushButtonRivet} />

          {/* raised cap */}
          <circle
            cx="48"
            cy="107"
            r="8.5"
            className={`${styles.pushButtonCap} ${
              pressAnim ? styles.pushButtonCapPressed : ""
            }`}
          />
        </g>
      </svg>
    </div>
  );
}

// standalone led doodad — still used in the mobile interactive bench.
// it manages its own on/off state when no `on`/`onToggle` props are
// passed (which also fixes the crash the mobile bench had before,
// where clicking called an undefined onToggle).
function LedDoodad({ x, y, rot, isMobile, on, onToggle }) {
  const [selfOn, setSelfOn] = useState(false);
  const isOn = typeof on === "boolean" ? on : selfOn;

  return (
    <button
      type="button"
      className={styles.doodad}
      style={doodadStyle(x, y, rot, isMobile)}
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

export default function Container() {
  const [open, setOpen] = useState(null);
  const [isCircuitOn, setIsCircuitOn] = useState(true);
  const [scopeScale, setScopeScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // the breadboard's led — toggled by the breadboard's push button
  const [ledOn, setLedOn] = useState(false);

  const handleBreadboardButtonPress = () => {
    setLedOn((prev) => !prev);
  };

  useEffect(() => {
    function handleResize() {
      // matches the css breakpoint where the collage collapses to a grid
      // (Home.module.css) so the absolutely-positioned doodads never
      // render on top of the stacked layout
      setIsMobile(window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleKnobTurn = (totalTurns) => {
    const scales = [1, 1.4, 0.2, 0.6];
    setScopeScale(scales[totalTurns % scales.length]);
  };

  function renderCard(project, i) {
    const external = project.href.startsWith("http");
    const cardStyle = {
      "--bg": project.tint,
      "--hover-bg": project.hoverBg,
      "--hover-border": project.hoverBorder,
      "--tilt": `${(i % 3) - 1}deg`,
    };
    const cardContent = (
      <>
        <span className={styles.cardTop}>
          <Image
            className={styles.logo}
            src={project.icon}
            alt=""
            width={44}
            height={44}
          />
          <h3>{project.title}</h3>
        </span>
        <span className={styles.rule} aria-hidden="true" />
        <p>{project.blurb}</p>

        {project.photo && (
          <span className={styles.cardPhotoReveal} aria-hidden="true">
            <img src={project.photo} alt="" className={styles.cardPhoto} />
            <span className={styles.cardPhotoLabel}>{project.title}</span>
          </span>
        )}
      </>
    );

    if (external) {
      return (
        <button
          type="button"
          className={styles.card}
          style={cardStyle}
          onClick={() => openProject(project.href, project.title, setOpen)}
        >
          {cardContent}
        </button>
      );
    }

    return (
      <Link href={project.href} className={styles.card} style={cardStyle}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.collage} style={{ position: "relative" }}>
        {COLLAGE_ORDER.map((entry) => {
          if (entry.type === "card") {
            const project = CARDS_BY_SLUG[entry.slug];
            if (!project) return null;
            const shapeClass =
              styles[SHAPE_CLASS[project.shape]] || styles.spotWide;
            return (
              <div
                key={`card-${project.slug}`}
                className={`${styles.cardSpot} ${shapeClass}`}
                style={{
                  "--x": project.pos.x,
                  "--y": project.pos.y,
                  "--rot": `${project.pos.rot}deg`,
                  "--z": project.pos.z,
                }}
              >
                {renderCard(project, 1)}
              </div>
            );
          }

          const p = PHOTOS_BY_SLUG[entry.slug];
          if (!p) return null;

          // Nudge moonpocket further to the left (from 27% to 24%)
          const customX =
            !isMobile && p.slug === "moonpocket" ? "24%" : p.pos.x;

          return (
            <button
              key={`photo-${p.slug}`}
              type="button"
              className={styles.photoItem}
              onClick={() => openProject(p.href, p.title, setOpen)}
              title={p.title}
              style={{
                "--x": customX,
                "--y": p.pos.y,
                "--w": `${p.pos.w}px`,
                "--rot": `${p.pos.rot}deg`,
                "--z": p.pos.z,
                "--float-delay": `${p.pos.delay}s`,
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                className={
                  p.hoverImage
                    ? `${styles.photo} ${styles.photoBase}`
                    : styles.photo
                }
                loading="lazy"
              />
              {p.hoverImage && (
                <img
                  src={p.hoverImage}
                  alt=""
                  aria-hidden="true"
                  className={`${styles.photo} ${styles.photoHoverImg}`}
                  loading="lazy"
                />
              )}
              <span className={styles.photoLabel} aria-hidden="true">
                {p.title}
              </span>
            </button>
          );
        })}

        {!isMobile && (
          <>
            <StitchDoodad x="54%" y="5%" rot={-8} isMobile={false} />
            {/* Centered Knob & Toggle perfectly under the 63% horizontal coordinate of the screen */}
            <KnobDoodad
              x="61%"
              y="33%"
              rot={0}
              onTurn={handleKnobTurn}
              isMobile={false}
            />
            <ToggleDoodad
              x="65%"
              y="33%"
              rot={0}
              active={isCircuitOn}
              onToggle={() => setIsCircuitOn(!isCircuitOn)}
              isMobile={false}
            />

            <TermDoodad x="8%" y="79%" rot={-2} isMobile={false} />
            <ResistorDoodad x="93%" y="57%" rot={6} isMobile={false} />
            <ScopeDoodad
              x="63%"
              y="23%"
              rot={-1}
              isPowered={isCircuitOn}
              scale={scopeScale}
              isMobile={false}
            />
            <ChipDoodad isMobile={false} />
            <BreadboardDoodad
              x="76%"
              y="-10%"
              rot={-4}
              isMobile={false}
              ledOn={ledOn}
              onButtonPress={handleBreadboardButtonPress}
            />
          </>
        )}
      </div>

      {isMobile && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            margin: "40px auto 10px auto",
            padding: "24px 16px",
            background: "rgba(255, 255, 255, 0.4)",
            border: "2px dashed #beb0eb",
            borderRadius: "24px",
            maxWidth: "340px",
            width: "90%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#9d96e7",
              letterSpacing: "1px",
            }}
          >
            ─── INTERACTIVE BENCH ───
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <ScopeDoodad
              isPowered={isCircuitOn}
              scale={scopeScale}
              isMobile={true}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 4px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "65px",
              }}
            >
              <KnobDoodad onTurn={handleKnobTurn} isMobile={true} />
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "#a0a0a0",
                  marginTop: "4px",
                }}
              >
                scale
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "65px",
              }}
            >
              <ToggleDoodad
                active={isCircuitOn}
                onToggle={() => setIsCircuitOn(!isCircuitOn)}
                isMobile={true}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "#a0a0a0",
                  marginTop: "12px",
                }}
              >
                power
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "50px",
                height: "50px",
              }}
            >
              <LedDoodad isMobile={true} />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "50px",
                height: "50px",
              }}
            >
              <ResistorDoodad isMobile={true} />
            </div>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <TermDoodad isMobile={true} />
          </div>
        </div>
      )}

      <div className={styles.sectionDivider}>
        <span className={styles.dividerLine} aria-hidden="true" />
        <span className={styles.dividerText}>toolkit &amp; resources</span>
        <span className={styles.dividerLine} aria-hidden="true" />
      </div>

      <div className={styles.resourcesGrid}>
        {resources.map((resource, i) => (
          <span key={resource.slug} style={{ display: "contents" }}>
            {renderCard(resource, i)}
          </span>
        ))}
      </div>

      {open && (
        <IframePanel
          url={open.href}
          title={open.title}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
