// the communal punch card. every visitor punches one hole, and they
// pick which one, like punching a real card by hand. the machine knits
// from the bottom row up, so a row only knits once all of its holes
// are punched. shared via /api/punch, falls back to per-device
// localStorage if there's no backend.
//
// cards cycle through several motifs instead of repeating the same
// one forever. the all-time punch count decides which card is on the
// machine, so adding, removing, or reordering motifs never renumbers
// or erases anyone's already-punched progress.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "../styles/PunchCard.module.css";
import PunchiEgg from "./PunchiEgg";
import {
  COLS,
  MOTIFS,
  MOTIF_DATA,
  currentCard,
  motifIndexForCard,
  knitRowCount,
  yarnForCard,
  wash,
} from "../data/punchMotifs";

// how long a finished card stays on the machine before the next one
// feeds in, so whoever punched the last hole gets to see it whole
const FINISHED_HOLD_MS = 2600;

const LOCAL_COUNT_KEY = "electrocute:punchcard:local-count";
const LOCAL_HOLES_KEY = "electrocute:punchcard:local-holes";
const PUNCHED_KEY = "electrocute:punchcard:punched";

function readLocalHoles(cardNo, punchedBefore) {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_HOLES_KEY));
    if (saved && saved.card === cardNo) return saved.holes;
  } catch {
    // nothing saved yet
  }
  // older local cards were punched in carriage order
  return Array.from({ length: punchedBefore }, (_, i) => i);
}

export default function PunchCard() {
  const [count, setCount] = useState(null);
  const [shared, setShared] = useState(false);
  // the card on the machine and which of its holes are punched
  const [cardNo, setCardNo] = useState(1);
  const [holes, setHoles] = useState([]);
  const [hasPunched, setHasPunched] = useState(false);
  const [myHole, setMyHole] = useState(null);
  const [myCard, setMyCard] = useState(null);
  const [justPunched, setJustPunched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  // true when this visitor's hole was the last one on the card
  const [finishedCard, setFinishedCard] = useState(false);
  // keeps a just-finished card on screen for a moment before moving on
  const [held, setHeld] = useState(null);
  // rows knit before this visitor's punch, so new rows can knit in
  const [knitBefore, setKnitBefore] = useState(0);
  // roving focus for keyboard: one hole is tabbable, arrows move it
  const [focusIdx, setFocusIdx] = useState(null);
  const holeRefs = useRef({});
  // on touchscreens the holes are too small to hit, so a tap picks the
  // nearest open hole and a button confirms the punch
  const [touch, setTouch] = useState(false);
  const [picked, setPicked] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const applyServer = (data) => {
    if (typeof data.count === "number") setCount(data.count);
    if (typeof data.card === "number") setCardNo(data.card);
    if (Array.isArray(data.holes)) setHoles(data.holes);
  };

  const loadLocal = () => {
    const localCount = Number(localStorage.getItem(LOCAL_COUNT_KEY)) || 0;
    const card = currentCard(localCount);
    setCount(localCount);
    setCardNo(card.cardNo);
    setHoles(readLocalHoles(card.cardNo, card.punchedBefore));
  };

  useEffect(() => {
    setHasPunched(Boolean(localStorage.getItem(PUNCHED_KEY)));
    let alive = true;
    fetch("/api/punch")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data.shared && typeof data.count === "number") {
          setShared(true);
          applyServer(data);
        } else {
          loadLocal();
        }
      })
      .catch(() => {
        if (alive) loadLocal();
      });
    return () => {
      alive = false;
    };
  }, []);

  // after the finished card has been shown off, catch up with the
  // next card, which other people may have started on already
  const releaseHeld = () => {
    setHeld(null);
    if (!shared) return;
    fetch("/api/punch")
      .then((res) => res.json())
      .then((data) => data.shared && applyServer(data))
      .catch(() => {});
  };

  const done = () => {
    localStorage.setItem(PUNCHED_KEY, "1");
    setHasPunched(true);
    setTimeout(() => setJustPunched(false), 1500);
  };

  const punch = async (hole) => {
    if (hasPunched || busy || count === null) return;
    if (holes.includes(hole)) return;
    const data = MOTIF_DATA[motifIndexForCard(cardNo)];
    setBusy(true);
    setNotice("");
    setKnitBefore(knitRowCount(data, holes));

    if (shared) {
      try {
        const res = await fetch("/api/punch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hole }),
        });
        const result = await res.json();
        if (res.status === 409) {
          applyServer(result);
          setNotice("someone just punched that one! pick another hole.");
          setBusy(false);
          return;
        }
        if (!res.ok) throw new Error("punch failed");
        setMyHole(hole);
        setMyCard(result.card);
        setJustPunched(true);
        if (result.completed) {
          setFinishedCard(true);
          setHeld({ cardNo: result.card, holes: result.holes });
          setTimeout(releaseHeld, FINISHED_HOLD_MS);
        }
        applyServer(result);
        done();
      } catch {
        setNotice("the machine jammed, try again in a moment.");
      }
      setBusy(false);
      return;
    }

    // no backend: keep the card on this device
    const nextHoles = [...holes, hole].sort((a, b) => a - b);
    const nextCount = count + 1;
    localStorage.setItem(LOCAL_COUNT_KEY, String(nextCount));
    setMyHole(hole);
    setMyCard(cardNo);
    setJustPunched(true);
    if (nextHoles.length >= data.holeCount) {
      setFinishedCard(true);
      setHeld({ cardNo, holes: nextHoles });
      const next = currentCard(nextCount);
      localStorage.setItem(
        LOCAL_HOLES_KEY,
        JSON.stringify({ card: next.cardNo, holes: [] }),
      );
      setCardNo(next.cardNo);
      setHoles([]);
      setTimeout(() => setHeld(null), FINISHED_HOLD_MS);
    } else {
      localStorage.setItem(
        LOCAL_HOLES_KEY,
        JSON.stringify({ card: cardNo, holes: nextHoles }),
      );
      setHoles(nextHoles);
    }
    setCount(nextCount);
    done();
    setBusy(false);
  };

  // which card to draw: the one just finished, while it's held up
  const shownCardNo = held ? held.cardNo : cardNo;
  const shownHoles = held ? held.holes : holes;
  const motifIndex = motifIndexForCard(shownCardNo);
  const motif = MOTIFS[motifIndex];
  const data = MOTIF_DATA[motifIndex];
  const {
    cells: CELLS,
    holes: HOLES,
    numRows: ROWS,
    holeCount: CARD_SIZE,
  } = data;
  const punchedSet = new Set(shownHoles);
  const punched = punchedSet.size;
  const cardsDone = shownCardNo - 1;
  const yarn = yarnForCard(shownCardNo);
  const knitRows = knitRowCount(data, shownHoles);

  const canPunch = !hasPunched && count !== null && !busy && !held;
  const openHoles = HOLES.map((_, i) => i).filter((i) => !punchedSet.has(i));
  const tabHole =
    focusIdx !== null && openHoles.includes(focusIdx) ? focusIdx : openHoles[0];
  const pickedHole =
    touch && canPunch && picked !== null && openHoles.includes(picked)
      ? picked
      : null;
  const mine = myCard === shownCardNo ? myHole : null;
  const myRowKnit = mine !== null && HOLES[mine].row >= ROWS - knitRows;

  // rows that knit because of this visitor's punch, to animate them in
  const freshRowStart = justPunched ? ROWS - knitRows : ROWS;
  const freshRowEnd = justPunched ? ROWS - knitBefore : ROWS;

  const onHoleKey = (e, i) => {
    const at = openHoles.indexOf(i);
    let to = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      to = openHoles[Math.min(at + 1, openHoles.length - 1)];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      to = openHoles[Math.max(at - 1, 0)];
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      punch(i);
      return;
    }
    if (to !== null && to !== undefined) {
      e.preventDefault();
      setFocusIdx(to);
      holeRefs.current[to]?.focus();
    }
  };

  const cell = 15;
  const edge = 22;
  const headH = 26;
  const holeX = (h) => edge + h.col * cell + cell / 2;
  const holeY = (h) => headH + h.row * cell + cell / 2;

  // a tap anywhere on the card picks the closest open hole, so it
  // doesn't matter if a fingertip lands a little off
  const pickNearest = (e) => {
    if (!touch || !canPunch) return;
    const svg = cardRef.current;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const { x, y } = pt.matrixTransform(ctm.inverse());
    let best = null;
    let bestDist = Infinity;
    openHoles.forEach((i) => {
      const d = Math.hypot(holeX(HOLES[i]) - x, holeY(HOLES[i]) - y);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (best !== null && bestDist <= cell * 2) {
      setPicked(best);
      setNotice("");
    }
  };
  const cardW = COLS * cell + edge * 2;
  const cardH = ROWS * cell + headH + 14;

  const st = 14;
  const fabW = COLS * st + 16;
  const fabH = ROWS * st + 16;

  return (
    <section id="punchcard" className={styles.punchcard}>
      <h2>the communal punch card</h2>
      <p className={styles.intro}>
        every visitor punches one hole, anywhere in the pattern. the machine
        knits from the bottom row up, so a row knits once all its holes are
        punched. the pattern changes with every new card.
      </p>

      <div className={styles.machine}>
        <svg
          key={`card-${shownCardNo}`}
          className={`${styles.card} ${styles.feedIn}`}
          viewBox={`0 0 ${cardW} ${cardH}`}
          ref={cardRef}
          role={canPunch ? "group" : "img"}
          onClick={pickNearest}
          aria-label={`${motif.name} punch card, ${punched} of ${CARD_SIZE} holes punched`}
        >
          <path
            d={`M 14 0 H ${cardW - 26} L ${cardW} 26 V ${cardH - 8} Q ${cardW} ${cardH} ${cardW - 8} ${cardH} H 8 Q 0 ${cardH} 0 ${cardH - 8} V 14 Q 0 0 14 0 Z`}
            fill="#f7f1df"
            stroke="#e6dcc0"
            strokeWidth="1.5"
          />
          <text x={edge} y={17} className={styles.cardLabel}>
            electrocute lab · 24 st · {motif.name} · card no.{shownCardNo}
          </text>

          {Array.from({ length: ROWS }, (_, r) => (
            <g key={`sp${r}`}>
              <circle
                cx={edge / 2}
                cy={headH + r * cell + cell / 2}
                r="3"
                fill="#4a4453"
              />
              <circle
                cx={cardW - edge / 2}
                cy={headH + r * cell + cell / 2}
                r="3"
                fill="#4a4453"
              />
            </g>
          ))}

          {CELLS.map((cellDef) => {
            const cx = edge + cellDef.col * cell + cell / 2;
            const cy = headH + cellDef.row * cell + cell / 2;
            const key = `${cellDef.row}-${cellDef.col}`;
            if (!cellDef.hole) {
              return <circle key={key} cx={cx} cy={cy} r="1" fill="#e6dcc0" />;
            }
            const i = HOLES.findIndex(
              (h) => h.row === cellDef.row && h.col === cellDef.col,
            );
            const isPunched = punchedSet.has(i);
            const isNewest = justPunched && mine === i;

            if (!isPunched && canPunch) {
              return (
                <g
                  key={key}
                  ref={(el) => {
                    holeRefs.current[i] = el;
                  }}
                  className={styles.openHole}
                  role="button"
                  tabIndex={i === tabHole ? 0 : -1}
                  aria-label={`punch row ${ROWS - cellDef.row}, stitch ${cellDef.col + 1}`}
                  onClick={touch ? undefined : () => punch(i)}
                  onKeyDown={(e) => onHoleKey(e, i)}
                  onFocus={() => setFocusIdx(i)}
                >
                  {/* bigger invisible target so it's easy to hit */}
                  <circle cx={cx} cy={cy} r={cell / 2} fill="transparent" />
                  {pickedHole === i && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      className={styles.pickRing}
                    />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4.5"
                    className={
                      pickedHole === i
                        ? `${styles.openHoleMark} ${styles.pickedMark}`
                        : styles.openHoleMark
                    }
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />
                </g>
              );
            }

            return (
              <g key={key}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill={isPunched ? "#4a4453" : "none"}
                  stroke={isPunched ? "#332e3d" : "#cfc3a2"}
                  strokeWidth="1.2"
                  strokeDasharray={isPunched ? "none" : "2 2"}
                  className={isNewest ? styles.newHole : undefined}
                />
                {isNewest && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#f7f1df"
                    stroke="#e6dcc0"
                    strokeWidth="1"
                    className={styles.chad}
                  />
                )}
              </g>
            );
          })}
        </svg>

        <svg
          key={`fabric-${shownCardNo}`}
          className={styles.fabric}
          viewBox={`0 0 ${fabW} ${fabH}`}
          role="img"
          aria-label={`knit preview in ${yarn.name}, ${knitRows} of ${ROWS} rows knit, ${punched} contrast stitches placed`}
        >
          <rect
            x="0"
            y="0"
            width={fabW}
            height={fabH}
            rx="8"
            fill={wash(yarn.base, 0.65)}
            stroke={wash(yarn.contrast, 0.35)}
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          {CELLS.map((cellDef) => {
            const key = `st-${cellDef.row}-${cellDef.col}`;
            const i = cellDef.hole
              ? HOLES.findIndex(
                  (h) => h.row === cellDef.row && h.col === cellDef.col,
                )
              : -1;
            const isContrast = i >= 0 && punchedSet.has(i);
            const isKnit = cellDef.row >= ROWS - knitRows;
            // rows the carriage hasn't reached yet only show the contrast
            // stitches people have punched, waiting faintly in place
            if (!isKnit && !isContrast) return null;
            const x = 8 + cellDef.col * st + st / 2;
            const y = 8 + cellDef.row * st + st / 2;
            const arm = st * 0.32;
            const color = isContrast ? yarn.contrast : yarn.base;
            const isFresh =
              (cellDef.row >= freshRowStart && cellDef.row < freshRowEnd) ||
              (justPunched && i >= 0 && i === mine);
            return (
              <g key={key} className={isFresh ? styles.newStitchV : undefined}>
                <g className={isKnit ? undefined : styles.waitingStitch}>
                  <line
                    x1={x - arm}
                    y1={y - arm}
                    x2={x}
                    y2={y + arm}
                    stroke={color}
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                  <line
                    x1={x + arm}
                    y1={y - arm}
                    x2={x}
                    y2={y + arm}
                    stroke={color}
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            );
          })}
        </svg>

        <p className={styles.yarn}>
          <span
            className={styles.yarnDot}
            style={{ background: yarn.base }}
            aria-hidden="true"
          />
          <span
            className={styles.yarnDot}
            style={{ background: yarn.contrast }}
            aria-hidden="true"
          />
          yarn: {yarn.name}
        </p>
      </div>

      <p className={styles.status}>
        {count === null ? (
          <>reading the card…</>
        ) : (
          <>
            {punched} of {CARD_SIZE} holes punched
            {" by visitors"} · row {knitRows} of {ROWS} on the machine
            {cardsDone > 0 && (
              <>
                {" "}
                · {cardsDone} {cardsDone === 1 ? "card" : "cards"} knit
              </>
            )}
          </>
        )}
      </p>

      {hasPunched ? (
        <p className={styles.punchedPill}>you&apos;ve punched your hole</p>
      ) : pickedHole !== null && !busy ? (
        <div className={styles.confirm}>
          <button
            type="button"
            className={styles.punchButton}
            onClick={() => punch(pickedHole)}
          >
            punch row {ROWS - HOLES[pickedHole].row}, stitch{" "}
            {HOLES[pickedHole].col + 1}
          </button>
          <p className={styles.hint}>or tap another hole</p>
        </div>
      ) : (
        <p className={styles.hint} aria-live="polite">
          {notice ||
            (count === null
              ? " "
              : busy
                ? "punching…"
                : touch
                  ? "tap a dashed hole on the card to pick it"
                  : "click any dashed hole on the card to punch it")}
        </p>
      )}

      {count !== null && (
        <PunchiEgg
          punched={punched}
          cardSize={CARD_SIZE}
          justPunched={justPunched}
        />
      )}

      {hasPunched && (
        <p className={styles.thanks}>
          {finishedCard ? (
            <>
              thank you! yours was the last hole.
              <br />
              that card is off the machine and saved to the archive.
            </>
          ) : mine === null || myRowKnit ? (
            <>
              thank you for punching a hole.
              <br />
              your stitch is part of the fabric now.
            </>
          ) : (
            <>
              thank you for punching a hole.
              <br />
              your stitch is waiting in the fabric until the carriage reaches its row.
            </>
          )}
        </p>
      )}

      <Link href="/punch-card-archive" className={styles.archiveLink}>
        see the finished cards →
      </Link>
    </section>
  );
}
