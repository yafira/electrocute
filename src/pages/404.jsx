import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "@/styles/About.module.css";

export default function NotFound() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const cssSize = Math.min(520, window.innerWidth - 48);
    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    ctx.scale(dpr, dpr);

    const N = 60; // squares in the tunnel
    const F = 0.9; // shrink factor (your 0.9)
    const ZOOM_MS = 2400; // one seamless zoom cycle
    const FLOWER_MS = 7000; // one flower descent
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const flower = new Image();
    flower.src = "/flower.png";

    let filled = false;
    let colors = [];

    // your pastel gradient: r 255→200, g 220→255, b 255→240
    const gradientColors = () => {
      colors = [];
      for (let i = 0; i < N; i++) {
        const t = i / N;
        colors.push(
          `rgb(${Math.round(255 - 55 * t)}, ${Math.round(
            220 + 35 * t,
          )}, ${Math.round(255 - 15 * t)})`,
        );
      }
    };
    const randomColors = () => {
      colors = colors.map(
        () =>
          `rgb(${200 + Math.floor(Math.random() * 56)}, ${
            200 + Math.floor(Math.random() * 56)
          }, ${220 + Math.floor(Math.random() * 36)})`,
      );
    };
    gradientColors();

    const onClick = () => {
      filled = !filled;
      if (filled) randomColors();
      else gradientColors();
    };
    canvas.addEventListener("click", onClick);

    let raf;
    const draw = (now) => {
      ctx.clearRect(0, 0, cssSize, cssSize);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cssSize, cssSize);

      const cx = cssSize / 2;
      const cy = cssSize / 2;

      // seamless infinite zoom: base size cycles by one shrink-step
      const frac = reduced ? 0 : (now % ZOOM_MS) / ZOOM_MS;
      let s = cssSize * 1.5 * Math.pow(1 / F, frac);

      for (let i = 0; i < N; i++) {
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        if (filled) {
          ctx.fillStyle = colors[i];
          ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
        }
        ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
        s *= F;
      }

      // the flower, falling in: shrinks, spins, fades into the center
      if (flower.complete && flower.naturalWidth) {
        const ft = reduced ? 0.25 : (now % FLOWER_MS) / FLOWER_MS;
        const scale = Math.pow(1 - ft, 1.6); // ease in — accelerates inward
        const size = 96 * scale;
        if (size > 1) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(ft * Math.PI * 4);
          ctx.globalAlpha = Math.min(1, scale * 1.5);
          ctx.drawImage(flower, -size / 2, -size / 2, size, size);
          ctx.restore();
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // single static frame once the flower loads
      flower.onload = () => draw(0);
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>404 — electrocute</title>
      </Head>

      <Header />

      <main className={`${styles.About} ${styles.lost}`}>
        <canvas ref={canvasRef} className={styles.voidCanvas} />
        <h2>404</h2>
        <p>this page fell into the void</p>
        <p>
          <Link href="/">take me home</Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
