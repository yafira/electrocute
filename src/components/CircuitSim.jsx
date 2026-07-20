import Head from "next/head";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/CircuitSimPage.module.css";

// the simulator is pointer-driven and window-measuring, so it only
// makes sense client-side
const CircuitSim = dynamic(() => import("@/components/CircuitSim"), {
  ssr: false,
});

export default function CircuitSimPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>soft circuit simulator — electrocute</title>
        <meta
          name="description"
          content="drag felt petals, stitch ring snaps together, and watch current run through the seam. a browser toy built on the electric craft function color code."
        />
        <meta
          property="og:title"
          content="soft circuit simulator — electrocute"
        />
        <meta
          property="og:description"
          content="drag felt petals, stitch ring snaps together, watch current run through the seam."
        />
      </Head>

      <Header />

      <main className={styles.page}>
        <section className={styles.intro}>
          <h1>soft circuit simulator</h1>
          <p>
            a browser version of how i actually build: felt petals with ring
            snaps, stitched together with conductive thread. each color has a
            job — <strong className={styles.blush}>blush is power</strong>,{" "}
            <strong className={styles.matcha}>matcha is input</strong>,{" "}
            <strong className={styles.wisteria}>wisteria is output</strong>,{" "}
            <strong className={styles.butter}>butter is wires</strong>. close
            the loop and press the button to light the led.
          </p>
        </section>

        <CircuitSim />

        <section className={styles.outro}>
          <p>
            this is the same function color code used in <em>electric craft</em>
            , the soft circuit starter kit i&apos;m building at electrocute lab
            — the soft version of snap circuits. everything you can stitch here,
            you can sew for real.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
