import { useMemo, useRef, useState } from "react";
import styles from "@/styles/CircuitSim.module.css";

// soft circuit simulator
// draggable felt petals on an svg canvas. release a petal near
// another petal's ring snap and a butter thread stitches them
// together. the circuit graph is re-evaluated on every change:
// close a loop from blush (power) through matcha (input) to
// wisteria (output) and the running stitch comes alive.
//
// function color code, same as the electric craft kit:
//   blush = power · matcha = input · wisteria = output · butter = wires

const VB_W = 900;
const VB_H = 540;
const SNAP = 52; // how far a thread can reach between rings
const MAX_LINKS_PER_TERMINAL = 2;

const PART_DEFS = {
  battery: {
    label: "power",
    w: 118,
    h: 74,
    termX: 50,
    fill: "#fecfe2",
    stroke: "#e8a7c6",
  },
  button: {
    label: "input",
    w: 110,
    h: 74,
    termX: 46,
    fill: "#d9efce",
    stroke: "#a3cf92",
  },
  led: {
    label: "output",
    w: 110,
    h: 74,
    termX: 46,
    fill: "#e3d9fb",
    stroke: "#bda9e3",
  },
  wire: {
    label: "wire",
    w: 152,
    h: 58,
    termX: 67,
    fill: "#faf0c8",
    stroke: "#e0cd8f",
  },
};

const INITIAL_PARTS = [
  { id: "p1", type: "battery", x: 220, y: 290, on: false },
  { id: "p2", type: "button", x: 450, y: 190, on: false },
  { id: "p3", type: "led", x: 680, y: 290, on: false },
];

let nextId = 10;

const tKey = (id, i) => `${id}:${i}`;

function termPos(part, i) {
  const def = PART_DEFS[part.type];
  return { x: part.x + (i === 0 ? -def.termX : def.termX), y: part.y };
}

export default function CircuitSim() {
  const [parts, setParts] = useState(INITIAL_PARTS);
  const [links, setLinks] = useState([]);
  const svgRef = useRef(null);
  const drag = useRef(null);

  // graph evaluation
  const { powered, closedCount } = useMemo(() => {
    const adj = new Map();
    const addEdge = (a, b) => {
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a).push(b);
      adj.get(b).push(a);
    };

    // internal edges: current passes through wires and leds freely,
    // through buttons only while pressed. batteries are the source,
    // no internal edge, the loop must close around the outside.
    for (const p of parts) {
      if (p.type === "wire" || p.type === "led") {
        addEdge(tKey(p.id, 0), tKey(p.id, 1));
      } else if (p.type === "button" && p.on) {
        addEdge(tKey(p.id, 0), tKey(p.id, 1));
      }
    }
    for (const l of links) addEdge(l.a, l.b);

    const componentFrom = (start) => {
      const seen = new Set([start]);
      const queue = [start];
      while (queue.length) {
        const cur = queue.pop();
        for (const nxt of adj.get(cur) || []) {
          if (!seen.has(nxt)) {
            seen.add(nxt);
            queue.push(nxt);
          }
        }
      }
      return seen;
    };

    const poweredSet = new Set();
    let closed = 0;
    for (const p of parts) {
      if (p.type !== "battery") continue;
      const comp = componentFrom(tKey(p.id, 0));
      if (comp.has(tKey(p.id, 1))) {
        closed += 1;
        for (const k of comp) poweredSet.add(k);
      }
    }
    return { powered: poweredSet, closedCount: closed };
  }, [parts, links]);

  const linkCounts = useMemo(() => {
    const counts = new Map();
    for (const l of links) {
      counts.set(l.a, (counts.get(l.a) || 0) + 1);
      counts.set(l.b, (counts.get(l.b) || 0) + 1);
    }
    return counts;
  }, [links]);

  const isLedLit = (p) =>
    p.type === "led" &&
    powered.has(tKey(p.id, 0)) &&
    powered.has(tKey(p.id, 1)) &&
    (linkCounts.get(tKey(p.id, 0)) || 0) > 0 &&
    (linkCounts.get(tKey(p.id, 1)) || 0) > 0;

  const isPartLive = (p) =>
    powered.has(tKey(p.id, 0)) || powered.has(tKey(p.id, 1));

  // coordinates
  const toSvg = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const scale = VB_W / rect.width;
    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    };
  };

  // interaction
  const onPartPointerDown = (e, id) => {
    e.preventDefault();
    const part = parts.find((p) => p.id === id);
    if (!part) return;
    const pt = toSvg(e);
    drag.current = {
      id,
      offX: pt.x - part.x,
      offY: pt.y - part.y,
      moved: false,
      unlinked: false,
    };
    try {
      svgRef.current.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const pt = toSvg(e);
    const x = Math.min(VB_W - 70, Math.max(70, pt.x - d.offX));
    const y = Math.min(VB_H - 60, Math.max(55, pt.y - d.offY));

    const part = parts.find((p) => p.id === d.id);
    if (!d.moved && part && Math.hypot(x - part.x, y - part.y) > 4) {
      d.moved = true;
    }
    if (d.moved && !d.unlinked) {
      // picking a petal up un-stitches it; connections re-form on drop
      d.unlinked = true;
      setLinks((ls) =>
        ls.filter(
          (l) => !l.a.startsWith(d.id + ":") && !l.b.startsWith(d.id + ":"),
        ),
      );
    }
    if (d.moved) {
      setParts((ps) => ps.map((p) => (p.id === d.id ? { ...p, x, y } : p)));
    }
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;

    if (!d.moved) {
      // a tap: buttons toggle
      setParts((ps) =>
        ps.map((p) =>
          p.id === d.id && p.type === "button" ? { ...p, on: !p.on } : p,
        ),
      );
      return;
    }

    // try to stitch each ring of the dropped petal to the nearest
    // free ring on another petal
    setParts((currentParts) => {
      const dropped = currentParts.find((p) => p.id === d.id);
      if (!dropped) return currentParts;

      setLinks((currentLinks) => {
        const counts = new Map();
        for (const l of currentLinks) {
          counts.set(l.a, (counts.get(l.a) || 0) + 1);
          counts.set(l.b, (counts.get(l.b) || 0) + 1);
        }
        const newLinks = [...currentLinks];
        const usedTargets = new Set();

        for (let i = 0; i < 2; i++) {
          const myKey = tKey(dropped.id, i);
          if ((counts.get(myKey) || 0) >= MAX_LINKS_PER_TERMINAL) continue;
          const myPos = termPos(dropped, i);

          let best = null;
          let bestDist = SNAP;
          for (const other of currentParts) {
            if (other.id === dropped.id) continue;
            for (let j = 0; j < 2; j++) {
              const otherKey = tKey(other.id, j);
              if (usedTargets.has(otherKey)) continue;
              if ((counts.get(otherKey) || 0) >= MAX_LINKS_PER_TERMINAL)
                continue;
              const op = termPos(other, j);
              const dist = Math.hypot(op.x - myPos.x, op.y - myPos.y);
              if (dist < bestDist) {
                bestDist = dist;
                best = otherKey;
              }
            }
          }
          if (best) {
            newLinks.push({ a: myKey, b: best });
            usedTargets.add(best);
            counts.set(myKey, (counts.get(myKey) || 0) + 1);
            counts.set(best, (counts.get(best) || 0) + 1);
          }
        }
        return newLinks;
      });
      return currentParts;
    });
  };

  const removePart = (id) => {
    setParts((ps) => ps.filter((p) => p.id !== id));
    setLinks((ls) =>
      ls.filter((l) => !l.a.startsWith(id + ":") && !l.b.startsWith(id + ":")),
    );
  };

  const addPart = (type) => {
    const jitter = () => (Math.random() - 0.5) * 60;
    setParts((ps) => [
      ...ps,
      {
        id: "p" + nextId++,
        type,
        x: VB_W / 2 + jitter(),
        y: VB_H / 2 + jitter(),
        on: false,
      },
    ]);
  };

  const reset = () => {
    setParts(INITIAL_PARTS);
    setLinks([]);
  };

  // position lookup for threads
  const posOf = (key) => {
    const [id, i] = key.split(":");
    const part = parts.find((p) => p.id === id);
    return part ? termPos(part, Number(i)) : { x: 0, y: 0 };
  };

  const termLive = (key) => powered.has(key) && (linkCounts.get(key) || 0) > 0;

  return (
    <div className={styles.sim}>
      <div className={styles.palette}>
        {Object.entries(PART_DEFS).map(([type, def]) => (
          <button
            key={type}
            type="button"
            className={styles.paletteBtn}
            style={{ "--chip": def.fill, "--chipStroke": def.stroke }}
            onClick={() => addPart(type)}
          >
            <span className={styles.paletteChip} aria-hidden="true" />
            add {def.label}
          </button>
        ))}
        <button type="button" className={styles.resetBtn} onClick={reset}>
          start over
        </button>
      </div>

      <svg
        ref={svgRef}
        className={styles.canvas}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="application"
        aria-label="soft circuit simulator canvas"
      >
        {/* threads (drawn under the petals) */}
        {links.map((l, idx) => {
          const a = posOf(l.a);
          const b = posOf(l.b);
          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2 + 16; // a little thread sag
          const live = powered.has(l.a);
          return (
            <path
              key={idx}
              d={`M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`}
              className={live ? styles.threadLive : styles.thread}
              fill="none"
            />
          );
        })}

        {/* petals */}
        {parts.map((p) => {
          const def = PART_DEFS[p.type];
          const live = isPartLive(p);
          const lit = isLedLit(p);
          return (
            <g
              key={p.id}
              transform={`translate(${p.x} ${p.y})`}
              className={styles.part}
              onPointerDown={(e) => onPartPointerDown(e, p.id)}
              onDoubleClick={() => removePart(p.id)}
            >
              {/* felt tab */}
              <rect
                x={-def.w / 2}
                y={-def.h / 2}
                width={def.w}
                height={def.h}
                rx={26}
                fill={def.fill}
                stroke={def.stroke}
                strokeWidth={2}
              />
              {/* running stitch, marches when the circuit is live */}
              <rect
                x={-def.w / 2 + 7}
                y={-def.h / 2 + 7}
                width={def.w - 14}
                height={def.h - 14}
                rx={20}
                fill="none"
                className={live ? styles.stitchLive : styles.stitch}
              />

              {/* the component itself */}
              {p.type === "battery" && (
                <>
                  <circle
                    r={16}
                    fill="#eeeaf4"
                    stroke="#b9b3c6"
                    strokeWidth={2}
                  />
                  <text y={4} className={styles.coinLabel}>
                    3v
                  </text>
                </>
              )}
              {p.type === "button" && (
                <circle
                  r={p.on ? 11 : 14}
                  fill={p.on ? "#8fbf7c" : "#b7dcae"}
                  stroke="#7dab6b"
                  strokeWidth={2}
                />
              )}
              {p.type === "led" && (
                <circle
                  r={12}
                  fill={lit ? "#fff2a0" : "#cfc4e8"}
                  stroke={lit ? "#e8c94f" : "#a794cf"}
                  strokeWidth={2}
                  className={lit ? styles.ledLit : undefined}
                />
              )}
              {p.type === "wire" && (
                <line
                  x1={-def.termX + 14}
                  x2={def.termX - 14}
                  y1={0}
                  y2={0}
                  className={styles.wireStitch}
                />
              )}

              <text y={def.h / 2 - 12} className={styles.partLabel}>
                {p.type === "button"
                  ? p.on
                    ? "input · on"
                    : "input · off"
                  : def.label}
              </text>

              {/* ring snaps */}
              {[0, 1].map((i) => {
                const cx = i === 0 ? -def.termX : def.termX;
                const liveTerm = termLive(tKey(p.id, i));
                return (
                  <g key={i} transform={`translate(${cx} 0)`}>
                    <circle
                      r={8.5}
                      fill={liveTerm ? "#faf0c8" : "#fffdf7"}
                      stroke="#2b2733"
                      strokeWidth={2.5}
                      className={liveTerm ? styles.snapLive : undefined}
                    />
                    <circle r={3} fill="#2b2733" />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      <div
        className={closedCount > 0 ? styles.statusLive : styles.status}
        role="status"
      >
        {closedCount > 0
          ? "⚡ current flowing — the stitch is live"
          : "circuit open — thread blush to wisteria and back again"}
      </div>
      <p className={styles.legend}>
        drag petals · release a ring near another to stitch them · tap the
        matcha petal to press its button · double-tap a petal to remove it
      </p>
    </div>
  );
}
