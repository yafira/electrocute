import styles from "../styles/Header.module.css";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [petals, setPetals] = useState([]);

  const rain = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const burst = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      left: 10 + Math.random() * 80,
      delay: Math.random() * 0.4,
      duration: 2 + Math.random() * 1.5,
      size: 14 + Math.random() * 14,
      spin: Math.random() > 0.5 ? 1 : -1,
    }));
    setPetals(burst);
    setTimeout(() => setPetals([]), 4200);
  };

  return (
    <div className={styles.Header}>
      <Link href="/">
        <h1 className={styles.logo}>
          <span>electrocute</span>
          <img
            src="/flower.png"
            alt=""
            className={styles.flower}
            onClick={rain}
          />
          <span>io</span>
        </h1>
      </Link>
      <nav className={styles.nav}>
        <Link href="/about">about</Link>
        <a href="blog.electrocute.io">blog</a>
        <Link href="/contact">contact</Link>
      </nav>

      {petals.map((p) => (
        <img
          key={p.id}
          src="/flower.png"
          alt=""
          aria-hidden="true"
          className={styles.petal}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--spin": p.spin,
          }}
        />
      ))}
    </div>
  );
}
