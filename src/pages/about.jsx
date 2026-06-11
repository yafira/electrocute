import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>about — electrocute</title>
        <meta
          name="description"
          content="yafira is a design engineer and creative technologist building soft machines at electrocute lab in nyc."
        />
      </Head>

      <Header />

      <main className={styles.About}>
        <section className={styles.intro}>
          <h1>
            hi, i&apos;m yafira aka electrocute
            <img src="/flower.png" alt="" className={styles.flower} />
          </h1>
          <p>
            I&apos;m a design engineer and creative technologist in New York
            City. I recently graduated from NYU&apos;s Interactive
            Telecommunications Program (ITP) with my master&apos;s degree, and I
            hold a B.S. in computer science from CUNY. I work across physical
            computing, embedded systems, e-textiles, and generative text —
            experimental interfaces where hardware, software, and material form
            meet.
          </p>
          <p>
            I&apos;m happiest somewhere between a soldering iron and a blinking
            cursor — art, design, science, technology, and writing have all
            pulled at me since I was small. Hardware is where my curiosity runs
            deepest: laying out a circuit, coaxing a microcontroller into doing
            something it wasn&apos;t quite meant to do, then fabricating it a
            soft body to live in. I gravitate toward slow, calm technology — I
            like to call it poetronics: electronics with the sensibility of a
            poem. I&apos;ve always had a heightened sense for detail, for
            textures and colors and how things feel in your hands. I believe
            machines can be tender.
          </p>
        </section>

        <section className={`${styles.card} ${styles.lavender}`}>
          <h2>the lab</h2>
          <p>
            Electrocute Lab is my independent practice and the home of this site
            — and the name is a little confession. In person I&apos;m quiet,
            calm, sometimes shy. Electrocute is my most vibrant self: the
            current that runs underneath, finally given somewhere to go. The
            name has been with me since 2015, but only in the past five years
            did it become the work itself: soft circuits, playful hardware,
            generative text, and small open-source tools, mixing technology with
            craft traditions.
          </p>
          <p>
            Always learning — a new fabrication technique, an unfamiliar
            microcontroller — and most of what I make is shared publicly so
            others can learn from it, remix it, or build on it. I got here
            because people generously shared their work with me, and I intend to
            keep that cycle going.
          </p>
        </section>

        <section className={`${styles.card} ${styles.cream}`}>
          <h2>the journey</h2>
          <p>
            The family computer is where it all began. Technically it belonged
            to everyone; practically it was mine. I was the kid who loved trains
            and tracks as much as Polly Pocket, the one who fixed whatever broke
            and taught herself HTML through Neopets pages and MySpace layouts
            while photos loaded line by line. Computers were the first thing I
            ever loved figuring out, and the tinkering never stopped.
          </p>
          <p>
            The route from there was scenic — words first, then a few detours,
            until electrical engineering pulled me toward the hidden mechanics
            of how things work and one programming class settled it. I switched
            to computer science and stayed.
          </p>
          <p>
            Along the way I got curious about the histories connecting textiles
            and computation, which eventually carried me to ITP. My thesis,{" "}
            <Link href="https://thesoft.computer">The Soft Computer</Link>, is a
            textile computing object with felt keys, a machine-knit body, and a
            Markov chain that generates poetry on an e-ink display — an argument
            that softness and craft belong in the interface, not next to it.
          </p>
        </section>

        <section className={`${styles.card} ${styles.butter}`}>
          <h2>the current</h2>
          <p>
            These days I&apos;m building experimental electronics, interactive
            objects, tiny playful things, and web tools, and writing about the
            process as I go. Away from the screen: fiddling with my knitting
            machine, playing chess, experimenting in the kitchen, and finding
            joy in small, lovely things — beautiful stationery, a perfectly
            designed snack wrapper.
          </p>
          <p>
            Aesthetically, I live in two worlds at once. In person I&apos;m all
            black everything, goth romantic, drawn to brutalist edges — while my
            digital world is pastels and all things cute. ¿Por qué no los dos?
            The tension is the point: softness hits harder with something dark
            underneath.
          </p>
          <p>
            I&apos;m always open to collaborating — if you want to make
            something soft, strange, or quietly magical together,{" "}
            <Link href="/contact">come say hi</Link>
            <img src="/flower.png" alt="" className={styles.flowerSmall} />
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
