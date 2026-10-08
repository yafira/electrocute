// a power cable from the breadboard's top right hole up into a little
// port on the "b" of the logo. both ends are found in the dom by their
// data attributes and the cable is redrawn whenever the layout moves.
// pressing the breadboard button sends a pulse of current up the
// cable, and while the board is on the current keeps flowing.

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../styles/PowerCable.module.css";
import { onPower } from "../lib/powerSurge";

const PLUG = 14; // length of the plug that sits in the logo's port

function centerOf(el, origin) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2 - origin.left,
    y: r.top + r.height / 2 - origin.top,
    right: r.right - origin.left,
  };
}

export default function PowerCable() {
  const layerRef = useRef(null);
  const [ends, setEnds] = useState(null);
  const [powered, setPowered] = useState(false);
  const [pulse, setPulse] = useState(0);

  const measure = useCallback(() => {
    const layer = layerRef.current;
    const hole = document.querySelector("[data-power-hole]");
    const socket = document.querySelector("[data-power-socket]");
    // the breadboard isn't rendered on small screens, so no cable there
    if (!layer || !hole || !socket) {
      setEnds(null);
      return;
    }
    const origin = layer.getBoundingClientRect();
    const h = centerOf(hole, origin);
    const s = centerOf(socket, origin);
    setEnds({ hx: h.x, hy: h.y, sx: s.right, sy: s.y });
  }, []);

  useEffect(() => {
    let frame;
    const schedule = () => {
      cancelAnimationFrame(frame);
      // two frames so react has finished re-rendering after a resize
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(measure);
      });
    };

    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    if (document.fonts) document.fonts.ready.then(schedule);

    // the logo font and the collage settle in over the first moments
    const settle = setInterval(schedule, 500);
    const stopSettle = setTimeout(() => clearInterval(settle), 4000);

    const off = onPower((on) => {
      setPowered(on);
      setPulse((n) => n + 1);
      schedule();
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      clearInterval(settle);
      clearTimeout(stopSettle);
      off();
    };
  }, [measure]);

  let path = null;
  if (ends) {
    const { hx, hy, sx, sy } = ends;
    const px = sx + PLUG; // where the cord meets the plug
    // leaves the hole straight up, loops round to the right of the
    // port, and hooks back into it from the side like a real cord
    const wx = px + 34;
    const wy = sy + 26;
    const rise = Math.max(30, (hy - wy) * 0.5);
    path =
      `M ${hx} ${hy - 12} ` +
      `C ${hx} ${hy - 12 - rise}, ${wx} ${wy + rise * 0.6}, ${wx} ${wy} ` +
      `S ${px + 26} ${sy}, ${px} ${sy}`;
  }

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      {ends && (
        <svg className={`${styles.cable} ${powered ? styles.powered : ""}`}>
          <path d={path} className={styles.sheath} />
          <path d={path} className={styles.core} />
          {pulse > 0 && (
            <path
              key={pulse}
              d={path}
              className={styles.surge}
              pathLength="100"
            />
          )}

          {/* jumper header seated in the breadboard hole */}
          <rect
            x={ends.hx - 3.5}
            y={ends.hy - 12}
            width="7"
            height="11"
            rx="1.5"
            className={styles.header}
          />
          <line
            x1={ends.hx}
            y1={ends.hy - 1}
            x2={ends.hx}
            y2={ends.hy + 1.5}
            className={styles.pin}
          />

          {/* plug pushed into the logo's port */}
          <rect
            x={ends.sx - 2}
            y={ends.sy - 4.5}
            width={PLUG + 2}
            height="9"
            rx="2"
            className={styles.plug}
          />
          <line
            x1={ends.sx + 3}
            y1={ends.sy - 4.5}
            x2={ends.sx + 3}
            y2={ends.sy + 4.5}
            className={styles.plugGrip}
          />
          <line
            x1={ends.sx + 6.5}
            y1={ends.sy - 4.5}
            x2={ends.sx + 6.5}
            y2={ends.sy + 4.5}
            className={styles.plugGrip}
          />
        </svg>
      )}
    </div>
  );
}
