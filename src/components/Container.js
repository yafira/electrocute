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
  { type: "card", slug: "electrodex" },
  { type: "photo", slug: "moonpocket" },
  { type: "card", slug: "soft-circuit-library" },
  { type: "card", slug: "synthwave-chimes" },
  { type: "photo", slug: "pocket-oracle-of-time" },
  { type: "card", slug: "sailor-moon-calculator" },
  { type: "photo", slug: "puffcast" },
  { type: "photo", slug: "custom-light-leds" },
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

function LedDoodad({ x, y, rot, isMobile }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      className={styles.doodad}
      style={doodadStyle(x, y, rot, isMobile)}
      onClick={() => {
        playSynthSound("led");
        setOn(!on);
      }}
      aria-pressed={on}
      aria-label="decorative led"
    >
      <span className={`${styles.ledDot} ${on ? styles.ledOn : ""}`} />
    </button>
  );
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

export default function Container() {
  const [open, setOpen] = useState(null);
  const [isCircuitOn, setIsCircuitOn] = useState(true);
  const [scopeScale, setScopeScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

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
                className={styles.photo}
                loading="lazy"
              />
              <span className={styles.photoLabel} aria-hidden="true">
                {p.title}
              </span>
            </button>
          );
        })}

        {!isMobile && (
          <>
            <StitchDoodad x="54%" y="5%" rot={-8} isMobile={false} />
            <LedDoodad x="23%" y="21%" rot={0} isMobile={false} />
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
