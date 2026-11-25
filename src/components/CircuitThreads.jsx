import { useEffect, useRef, useState } from "react";

// draws the threads that tie the nav circuit to the breadboard. each end
// is found through a data-thread attribute, so the threads follow the parts
// when the page moves or resizes.
const THREADS = [
  // the led's output is its cathode, so it returns to the - rail as ground
  { from: "led-out", to: "board-minus-led", color: "#2f2a3d", c1: [-6, 18], c2: [-14, 18] },
  // battery + and - share the same curve so they run as one bundle below the nav
  { from: "ninev-pos", to: "board-plus", color: "#e58fbf", c1: [50, -20], c2: [-50, -20] },
  // the battery's negative runs low under the nav and comes up the left
  // side into the - rail, staying above the cards
  { from: "ninev-neg", to: "board-minus", color: "#2f2a3d", c1: [50, 0], c2: [-50, -40] },
];

// a wire that wiggles between two points: a sine offset across the straight line
function wavyPath(a, b, { amp, waves, sag = 0 }) {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const nx = -(b.y - a.y) / len;
  const ny = (b.x - a.x) / len;
  const steps = 60;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const off = Math.sin(u * waves * Math.PI * 2) * amp * Math.sin(u * Math.PI);
    const x = a.x + (b.x - a.x) * u + nx * off;
    const y = a.y + (b.y - a.y) * u + ny * off + sag * Math.sin(Math.min(u / 0.35, 1) * Math.PI / 2) * Math.sin(Math.min((1 - u) / 0.35, 1) * Math.PI / 2);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

export default function CircuitThreads() {
  const ref = useRef(null);
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const measure = () => {
      const host = ref.current?.parentElement;
      if (!host) return;
      const origin = host.getBoundingClientRect();

      const point = (name) => {
        const el = document.querySelector(`[data-thread="${name}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - origin.left,
          y: r.top + r.height / 2 - origin.top,
        };
      };

      const next = THREADS.map((t) => {
        const a = point(t.from);
        const b = point(t.to);
        if (!a || !b) return null;
        return {
          d: t.wave
            ? wavyPath(a, b, t.wave)
            : `M${a.x},${a.y} C${a.x + t.c1[0]},${a.y + t.c1[1]} ${b.x + t.c2[0]},${b.y + t.c2[1]} ${b.x},${b.y}`,
          color: t.color,
        };
      }).filter(Boolean);

      setPaths(next);
    };

    measure();
    const id = setInterval(measure, 500);
    window.addEventListener("resize", measure);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke={p.color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
