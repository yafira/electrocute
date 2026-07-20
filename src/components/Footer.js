import styles from "../styles/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className={styles.Footer}>
      <h3>
        © 2023–2026 crafted with{" "}
        <FontAwesomeIcon icon={faHeart} style={{ color: "#B2A4D4" }} /> by{" "}
        <a href="https://yafira.xyz" target="_blank" rel="noopener noreferrer">
          yafira
        </a>
      </h3>

      <div className={styles.footerIcons}>
        <Link
          href="mailto:electrocutelab@protonmail.com"
          title="email"
          aria-label="email"
        >
          <Image
            src="/assets/email.png"
            alt=""
            width={22}
            height={22}
            aria-hidden="true"
          />
        </Link>
        <Link
          href="https://www.instagram.com/electrocutelab/"
          title="instagram"
          aria-label="instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/instagram.png"
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
        </Link>
      </div>

      <p className={styles.colophonLine}>
        <Link href="/colophon">colophon</Link>
      </p>
    </footer>
  );
}
