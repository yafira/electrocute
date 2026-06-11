import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Icons from "@/components/Icons";
import Footer from "@/components/Footer";
import styles from "@/styles/Contact.module.css";

export default function Contact() {
  return (
    <div className={styles.container}>
      <Head>
        <title>contact — electrocute</title>
        <meta
          name="description"
          content="get in touch with yafira: email, github, instagram, are.na, and more."
        />
      </Head>

      <Header />

      <main className={styles.Contact}>
        <section className={styles.card}>
          <h1>send a signal</h1>
          <p>
            the fastest way to reach me is email:{" "}
            <Link href="mailto:electrocutelab@protonmail.com">
              electrocutelab@protonmail.com
            </Link>
            .
          </p>
          <p>
            i&apos;m currently looking for design engineering and creative
            technology roles — the sweet spot where design and code meet,
            ideally with hardware in the mix. i light up at embedded electronics
            and hardware design, e-textiles, physical computing, and tactile
            interaction: wherever technology meets texture, gesture, or form.
          </p>
          <p>
            beyond roles, i&apos;m always happy to talk soft machines, swap
            notes on a build, or explore a collaboration.
          </p>
          <p>broadcasting from my corners of the web:</p>
          <Icons size={38} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
