import styles from "../styles/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Footer() {
  return (
    <div className={styles.Footer}>
      <h3>
        © 2025 made with{" "}
        <FontAwesomeIcon icon={faHeart} style={{ color: "#B2A4D4" }} /> by
        <Link href="https://bento.me/electrocute"> yafira </Link>
      </h3>
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
    </div>
  );
}
