import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/ComingSoon.module.css";

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

// placeholder for the craftcomputery shop until it opens.
// no link to the shop site yet on purpose.
export default function Craftcomputery() {
  return (
    <div className={styles.container}>
      <Head>
        <title>craftcomputery — electrocute</title>
        <meta
          name="description"
          content="craftcomputery, the craft-tech r&d division of electrocute lab. a small shop for handmade computing, coming soon."
        />
        <meta property="og:title" content="craftcomputery — electrocute" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
        <meta
          property="og:description"
          content="a small shop for handmade computing, coming soon."
        />
      </Head>

      <Header />

      <main className={styles.soon}>
        <h1 className={styles.logo}>
          <Flower />
          <span className={styles.wordmark}>craftcomputery</span>
          <span className={styles.byline}>by electrocute lab</span>
        </h1>
        <span className={styles.eyebrow}>coming soon</span>
        <p>
          the craft-tech r&amp;d division of electrocute lab, and a small shop
          for handmade computing. things are still brewing in the lab.
        </p>
        <p>
          in the meantime, follow along on{" "}
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
