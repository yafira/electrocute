// a box whose dashed border stitches itself into place the first
// time it scrolls into view, like a needle running around the edge.
// usage: <StitchBox><h2>featured in</h2>...</StitchBox>

import { useEffect, useId, useRef, useState } from "react";
import styles from "../styles/StitchBox.module.css";

export default function StitchBox({
  children,
  className = "",
  color = "#c5caef",
  radius = 14,
}) {
  const ref = useRef(null);
  const [sewn, setSewn] = useState(false);
  const maskId = useId().replace(/:/g, "stitch");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSewn(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSewn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.box} ${className}`}>
      <svg className={styles.border} aria-hidden="true">
        <defs>
          <mask id={maskId}>
            {/* a solid stroke that draws around the perimeter; it
                reveals the dashed rect beneath, so the dashes appear
                one by one instead of marching in place */}
            <rect
              className={`${styles.maskStroke} ${sewn ? styles.sewn : ""}`}
              rx={radius}
              pathLength="100"
            />
          </mask>
        </defs>
        <rect
          className={styles.stitches}
          rx={radius}
          pathLength="100"
          style={{ stroke: color }}
          mask={`url(#${maskId})`}
        />
      </svg>
      {children}
    </div>
  );
}
