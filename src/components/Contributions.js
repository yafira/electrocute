import styles from "../styles/Contributions.module.css";

export default function Contributions() {
  return (
    <section className={styles.contributions}>
      <h2>featured in</h2>

      <div className={styles.grid}>
        <article className={styles.item}>
          <div className={styles.flipbook}>
            <iframe
              allowFullScreen
              allow="clipboard-write"
              scrolling="no"
              className="fp-iframe"
              src="https://heyzine.com/flip-book/a1c7dca16d.html"
              title="growing bio-hci zine"
            />
          </div>
          <div className={styles.caption}>
            <h3>hello blob: agar as interface</h3>
          </div>
        </article>

        <article className={styles.item}>
          <div className={styles.badge}>
            <a
              href="https://internetphonebook.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://internetphonebook.net/images/badges/hand-with-flower-border-radius.png"
                alt="this website is in the internet phone book"
              />
            </a>
          </div>
          <div className={styles.caption}>
            <h3>dial-a-site: #17</h3>
          </div>
        </article>
      </div>
    </section>
  );
}
