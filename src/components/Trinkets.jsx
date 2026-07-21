import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

let audioCtx = null;

export function playSynthSound(type) {
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

export function TermTrinket({ x, y, rot, isMobile }) {
  const [i, setI] = useState(0);

  const styleSetting = isMobile
    ? {
        position: "relative",
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
// the center channel. pressing the button toggles the led on/off.
export function BreadboardTrinket({
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

          <rect
            x="34"
            y="92"
            width="28"
            height="30"
            rx="3"
            className={styles.pushButtonHousing}
          />

          <circle cx="39" cy="97" r="1.6" className={styles.pushButtonRivet} />
          <circle cx="57" cy="97" r="1.6" className={styles.pushButtonRivet} />
          <circle cx="39" cy="117" r="1.6" className={styles.pushButtonRivet} />
          <circle cx="57" cy="117" r="1.6" className={styles.pushButtonRivet} />

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
