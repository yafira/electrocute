import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const lines = [
  "a petal remembers how to open.",
  "a slow machine holds four kinds of memory.",
  "a ribbon argues in soft loops.",
  "the pocket waits by your hip.",
  "an hour unravels instead of ticking.",
  "a tender wire only lights when held gently.",
];

const TYPE_SPEED = 32; // ms per character

export default function PoetronicsCard({ project, index = 1 }) {
  const [display, setDisplay] = useState("");
  const [typing, setTyping] = useState(false);
  const timeoutRef = useRef(null);

  const cardStyle = {
    "--bg": project.tint,
    "--hover-bg": project.hoverBg,
    "--hover-border": project.hoverBorder,
    "--tilt": `${(index % 3) - 1}deg`,
  };

  const stop = () => {
    clearTimeout(timeoutRef.current);
    setTyping(false);
    setDisplay("");
  };

  const start = () => {
    const line = lines[Math.floor(Math.random() * lines.length)];
    setTyping(true);
    setDisplay("");
    let i = 0;
    const tick = () => {
      i += 1;
      setDisplay(line.slice(0, i));
      if (i < line.length) {
        timeoutRef.current = setTimeout(tick, TYPE_SPEED);
      }
    };
    timeoutRef.current = setTimeout(tick, TYPE_SPEED);
  };

  return (
    <Link
      href={project.href}
      className={styles.card}
      style={cardStyle}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <span className={styles.cardTop}>
        <Image
          className={styles.logo}
          src={project.icon}
          alt=""
          width={44}
          height={44}
          unoptimized
        />
        <h3>{project.title}</h3>
      </span>
      <span className={styles.rule} aria-hidden="true" />
      <p>
        {typing ? (
          <>
            {display}
            <span className="caret">▍</span>
          </>
        ) : (
          project.blurb
        )}
      </p>
      <style jsx>{`
        .caret {
          display: inline-block;
          animation: blink 0.9s steps(1) infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </Link>
  );
}
