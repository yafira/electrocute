import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import projects, { photoItems, resources } from "../data/projects";
import IframePanel, { openProject } from "./IframePanel";
import PoetronicsCard from "./PoetronicsCard";
import {
  StitchTrinket,
  KnobTrinket,
  ToggleTrinket,
  TermTrinket,
  ResistorTrinket,
  ScopeTrinket,
  ChipTrinket,
  BreadboardTrinket,
  LedTrinket,
} from "./Trinkets";

const COLLAGE_ORDER = [
  { type: "card", slug: "electrocute-ui" },
  { type: "photo", slug: "petalbyte" },
  { type: "card", slug: "soft-interfaces" },
  { type: "photo", slug: "the-soft-computer" },
  { type: "photo", slug: "ribbon-logic" },
  { type: "card", slug: "neural-nectar" },
  { type: "card", slug: "kawaii-ml" },
  { type: "photo", slug: "moonpocket" },
  { type: "card", slug: "poetronics" }, // ← new
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

export default function Container() {
  const [open, setOpen] = useState(null);
  const [isCircuitOn, setIsCircuitOn] = useState(true);
  const [scopeScale, setScopeScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const [ledOn, setLedOn] = useState(false);

  const handleBreadboardButtonPress = () => {
    setLedOn((prev) => !prev);
  };

  useEffect(() => {
    function handleResize() {
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
                {project.slug === "poetronics" ? (
                  <PoetronicsCard project={project} index={1} />
                ) : (
                  renderCard(project, 1)
                )}
              </div>
            );
          }

          const p = PHOTOS_BY_SLUG[entry.slug];
          if (!p) return null;

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
                "--label-offset": `${p.pos.labelOffset ?? 0}px`,
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
            <StitchTrinket x="54%" y="5%" rot={-8} isMobile={false} />
            <KnobTrinket
              x="61%"
              y="33%"
              rot={0}
              onTurn={handleKnobTurn}
              isMobile={false}
            />
            <ToggleTrinket
              x="65%"
              y="33%"
              rot={0}
              active={isCircuitOn}
              onToggle={() => setIsCircuitOn(!isCircuitOn)}
              isMobile={false}
            />

            <TermTrinket x="8%" y="79%" rot={-2} isMobile={false} />
            <ResistorTrinket x="93%" y="57%" rot={6} isMobile={false} />
            <ScopeTrinket
              x="63%"
              y="23%"
              rot={-1}
              isPowered={isCircuitOn}
              scale={scopeScale}
              isMobile={false}
            />
            <ChipTrinket isMobile={false} />
            <BreadboardTrinket
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
            <ScopeTrinket
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
              <KnobTrinket onTurn={handleKnobTurn} isMobile={true} />
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
              <ToggleTrinket
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
              <LedTrinket isMobile={true} />
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
              <ResistorTrinket isMobile={true} />
            </div>
          </div>

          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <TermTrinket isMobile={true} />
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
