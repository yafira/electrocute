import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/ComingSoon.module.css";
import { useAmbience } from "@/components/SoftPot";

// the craftcomputery mark: a rounded five-petal flower with a lilac bolt
const petals = [0, 72, 144, 216, 288].map((a) => {
  const r = ((a - 90) * Math.PI) / 180;
  return { cx: +(24 * Math.cos(r)).toFixed(2), cy: +(24 * Math.sin(r)).toFixed(2) };
});

function Flower({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="-50 -48 100 100" aria-hidden="true" className={styles.flower}>
      <g fill="#3a393c">
        {petals.map((p) => (
          <circle key={`${p.cx}${p.cy}`} cx={p.cx} cy={p.cy} r="21" />
        ))}
        <circle r="25" />
      </g>
      <polygon
        className={styles.bolt}
        points="4,-15 -8,3 -1,3 -4,15 8,-3 1,-3"
        fill="#efe4fc"
        stroke="#efe4fc"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// one neon tube: a glowing colored stroke with a hot white core
function Tube({ d, color, width = 5 }) {
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" filter="url(#neon-glow)" />
      <path d={d} fill="none" stroke="#fff6fb" strokeWidth={width * 0.36} strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </g>
  );
}

function NeonSign() {
  const lilac = "#b9a8ff";
  const pink = "#ff5fa2";
  const frame = "M72 108 Q66 108 66 114 L68 186 Q68 192 74 192 L268 182 Q274 182 274 176 L272 104 Q272 98 266 98 Z";
  return (
    <svg className={styles.neon} viewBox="0 0 340 240" role="img" aria-label="open now">
      <defs>
        <radialGradient id="bolt-metal" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f4f2f7" />
          <stop offset="45%" stopColor="#a9a5b3" />
          <stop offset="100%" stopColor="#4c4955" />
        </radialGradient>
        <filter id="neon-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="340" height="240">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="near" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="far" />
          <feMerge>
            <feMergeNode in="far" />
            <feMergeNode in="far" />
            <feMergeNode in="near" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* the dark wall and the clear acrylic plate the tubes are mounted on */}
      <rect width="340" height="240" rx="18" fill="#16141b" />
      <rect x="34" y="24" width="272" height="192" rx="6" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
      {/* standoff bolts holding the plate to the wall */}
      {[
        [48, 38],
        [292, 38],
        [48, 202],
        [292, 202],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x + 1} cy={y + 1.5} r="7" fill="rgba(0,0,0,0.5)" />
          <circle cx={x} cy={y} r="7" fill="url(#bolt-metal)" stroke="#2c2a33" strokeWidth="0.8" />
          <path d={`M${x - 3.2} ${y} L${x + 3.2} ${y} M${x} ${y - 3.2} L${x} ${y + 3.2}`} stroke="#3a3741" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ))}
      <g className={styles.neonFrame}>
        <Tube d="M170 36 a8 8 0 1 0 0.01 0" color={lilac} width={4.5} />
        <Tube d="M164 48 L104 104 M176 48 L236 100" color={lilac} width={4} />
        <Tube d={frame} color={lilac} />
      </g>
      <g className={styles.neonWords} transform="rotate(-3 170 145)">
        <text x="170" y="162" textAnchor="middle" textLength="176" lengthAdjust="spacingAndGlyphs" className={styles.neonScript} fill={pink} filter="url(#neon-glow)">
          open now
        </text>
        <text x="170" y="162" textAnchor="middle" textLength="176" lengthAdjust="spacingAndGlyphs" className={styles.neonScript} fill={pink} opacity="0.8" filter="url(#neon-glow)">
          open now
        </text>
        <text x="170" y="162" textAnchor="middle" textLength="176" lengthAdjust="spacingAndGlyphs" className={styles.neonScript} fill="#ffc2dc">
          open now
        </text>
      </g>
    </svg>
  );
}

// the craftcomputery page: the shop is open, this points people to it
export default function Craftcomputery() {
  useAmbience();
  return (
    <div className={styles.container}>
      <Head>
        <title>craftcomputery — electrocute</title>
        <meta
          name="description"
          content="craftcomputery, the craft-tech r&d division of electrocute lab. an artisanal shop for handmade computing, now open."
        />
        <meta property="og:title" content="craftcomputery — electrocute" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
        <meta
          property="og:description"
          content="an artisanal shop for handmade computing, now open."
        />
      </Head>

      <Header />

      <main className={styles.soon}>
        <h1 className={styles.logo}>
          <Flower />
          <span className={styles.wordmark}>craftcomputery</span>
          <span className={styles.byline}>by electrocute lab</span>
        </h1>
        {/* a little neon sign hanging in the window */}
        <NeonSign />
        {/* the day the shop opened, 11/22, the way the machine counts it */}
        <p className={styles.opened}>opened 1011 / 10110 · synchronous idle</p>
        <p>
          the craft-tech r&amp;d division of electrocute lab, and an artisanal shop
          for handmade computing.
        </p>
        <p>
          for now the shelves hold digital files. handmade physical pieces are
          still brewing in the lab, and they&apos;ll come out in small batches.
        </p>
        <a className={styles.visit} href="https://craftcomputery.com">
          visit the shop →
        </a>
        <p className={styles.follow}>
          follow along on{" "}
          <a
            href="https://instagram.com/craftcomputery"
            target="_blank"
            rel="noopener noreferrer"
          >
            @craftcomputery
          </a>
          .
        </p>
        <Link href="/" className={styles.back}>
          ← back to the lab
        </Link>
      </main>

      <Footer />
    </div>
  );
}
