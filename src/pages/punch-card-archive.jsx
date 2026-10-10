import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COLS, YARNS, yarnForCard, wash } from "@/data/punchMotifs";
import styles from "@/styles/PunchCardArchive.module.css";

// every communal punch card that visitors have finished, newest first.
// each one is drawn from the rows saved when it was completed: the
// fully punched card on top, the swatch it knit underneath.

const CELL = 12;
const EDGE = 18;
const HEAD = 22;
const STITCH = 11;

function formatDate(iso) {
  if (!iso) return "date not recorded";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function FinishedCard({ rows, label, title }) {
  const w = COLS * CELL + EDGE * 2;
  const h = rows.length * CELL + HEAD + 12;
  return (
    <svg
      className={styles.card}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
    >
      <path
        d={`M 12 0 H ${w - 22} L ${w} 22 V ${h - 7} Q ${w} ${h} ${w - 7} ${h} H 7 Q 0 ${h} 0 ${h - 7} V 12 Q 0 0 12 0 Z`}
        fill="#f7f1df"
        stroke="#e6dcc0"
        strokeWidth="1.5"
      />
      <text x={EDGE} y={15} className={styles.cardLabel}>
        {title}
      </text>
      {rows.map((row, r) => {
        const cy = HEAD + r * CELL + CELL / 2;
        return (
          <g key={r}>
            <circle cx={EDGE / 2} cy={cy} r="2.5" fill="#4a4453" />
            <circle cx={w - EDGE / 2} cy={cy} r="2.5" fill="#4a4453" />
            {[...row].map((ch, c) => {
              const cx = EDGE + c * CELL + CELL / 2;
              return ch === "#" ? (
                <circle
                  key={c}
                  cx={cx}
                  cy={cy}
                  r="3.6"
                  fill="#4a4453"
                  stroke="#332e3d"
                  strokeWidth="1"
                />
              ) : (
                <circle key={c} cx={cx} cy={cy} r="0.8" fill="#e6dcc0" />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function Swatch({ rows, yarn = YARNS[0] }) {
  const w = COLS * STITCH + 12;
  const h = rows.length * STITCH + 12;
  const arm = STITCH * 0.32;
  return (
    <svg
      className={styles.swatch}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label="the knit swatch this card made"
    >
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        rx="7"
        fill={wash(yarn.base, 0.65)}
        stroke={wash(yarn.contrast, 0.35)}
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      {rows.map((row, r) =>
        [...row].map((ch, c) => {
          const x = 6 + c * STITCH + STITCH / 2;
          const y = 6 + r * STITCH + STITCH / 2;
          const color = ch === "#" ? yarn.contrast : yarn.base;
          return (
            <g key={`${r}-${c}`}>
              <line
                x1={x - arm}
                y1={y - arm}
                x2={x}
                y2={y + arm}
                stroke={color}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1={x + arm}
                y1={y - arm}
                x2={x}
                y2={y + arm}
                stroke={color}
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}

export default function PunchCardArchive() {
  const [cards, setCards] = useState(null);
  const [shared, setShared] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch("/api/punch-archive")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        setShared(Boolean(data.shared));
        setCards(data.cards || []);
        setTotal(Number(data.total) || 0);
      })
      .catch(() => alive && setCards([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>punch card archive — electrocute</title>
        <meta
          name="description"
          content="every communal punch card finished by visitors to electrocute lab, and the swatch each one knit."
        />
      </Head>

      <Header />

      <main className={styles.archive}>
        <section className={styles.intro}>
          <span className={styles.eyebrow}>finished cards</span>
          <h1>the punch card archive</h1>
          <p>
            every card here was punched one hole at a time, one visitor per
            hole. when the last hole lands, the card comes off the machine and
            is kept here with the swatch it knit.
          </p>
          <Link href="/#punchcard" className={styles.back}>
            ← punch the current card
          </Link>
        </section>

        {cards === null && <p className={styles.empty}>opening the drawer…</p>}

        {cards !== null && cards.length === 0 && (
          <p className={styles.empty}>
            {shared
              ? "no cards finished yet. the first one is still on the machine."
              : "the archive lives on the shared card, which isn't connected here."}
          </p>
        )}

        {cards && cards.length > 0 && (
          <ol className={styles.grid}>
            {cards.map((c) => (
              <li key={c.card} className={styles.entry}>
                <FinishedCard
                  rows={c.rows}
                  label={`card no.${c.card}, ${c.motif}, fully punched`}
                  title={`electrocute lab · 24 st · ${c.motif} · card no.${c.card}`}
                />
                <Swatch rows={c.rows} yarn={c.yarn || yarnForCard(c.card)} />
                <p className={styles.meta}>
                  <span>card no.{c.card}</span>
                  <span>{c.motif}</span>
                  <span>{(c.yarn || yarnForCard(c.card)).name}</span>
                  <span>{formatDate(c.completedAt)}</span>
                </p>
              </li>
            ))}
          </ol>
        )}

        {cards && cards.length > 0 && (
          <section className={styles.thanks}>
            <h2>thank you</h2>
            <p>
              to everyone who stopped by and punched a hole: these cards are
              yours. {total} {total === 1 ? "hole" : "holes"} so far, one
              visitor at a time, and every one of them is a stitch in this
              fabric.
            </p>
            <p className={styles.signoff}>— yafira, electrocute lab</p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
