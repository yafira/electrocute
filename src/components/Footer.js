import styles from "../styles/Footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

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
    </footer>
  );
}
