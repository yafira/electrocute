import styles from "../styles/Header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <div className={styles.Header}>
      <Link href="/">
        <h1 className={styles.logo}>
          <span>electrocute</span>
          <img src="/flower.png" alt="" className={styles.flower} />
          <span>io</span>
        </h1>
      </Link>
    </div>
  );
}
