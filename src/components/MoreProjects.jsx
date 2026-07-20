// a few craft/hardware photos, used as page decoration — not a
// project listing (see src/data/craftProjects.js). scattered around
// the edges of the project grid (rendered as a sibling inside the
// same relative-positioned wrapper in index.js), each at its own
// spot/rotation/size. clicking one that has a link opens it in the
// same floating IframePanel used by the main project grid. hidden
// on narrow screens, where there's no room around the grid for them
// to sit without overlapping cards.

import { useState } from "react";
import IframePanel from "./IframePanel";
import styles from "../styles/MoreProjects.module.css";

// hand-placed spots around the grid's edges — top/left are
// percentages of the wrapper, so they hold their relative position
// as the grid reflows across breakpoints instead of drifting.
const SPOTS = [
  { top: "-6%", left: "-4%", rot: -8, width: 132 }, // top-left corner
  { top: "-5%", left: "90%", rot: 7, width: 118 }, // top-right corner
  { top: "42%", left: "-7%", rot: 6, width: 122 }, // left edge, mid-height
  { top: "40%", left: "96%", rot: -6, width: 128 }, // right edge, mid-height
  { top: "101%", left: "38%", rot: -4, width: 140 }, // bottom edge
];

export default function MoreProjects() {
  const [open, setOpen] = useState(null);

  return (
    <div className={styles.decor} aria-hidden={false}>
      {craftProjects.map((project, i) => {
        const spot = SPOTS[i % SPOTS.length];
        const style = {
          "--top": spot.top,
          "--left": spot.left,
          "--rot": `${spot.rot}deg`,
          "--w": `${spot.width}px`,
        };

        const image = (
          <img
            src={project.image}
            alt={project.title}
            className={styles.photo}
            loading="lazy"
          />
        );

        if (project.href) {
          return (
            <button
              key={project.slug}
              type="button"
              className={styles.item}
              style={style}
              onClick={() =>
                setOpen({ href: project.href, title: project.title })
              }
              title={project.title}
            >
              {image}
            </button>
          );
        }

        return (
          <div
            key={project.slug}
            className={styles.item}
            style={style}
            title={project.title}
          >
            {image}
          </div>
        );
      })}

      {open && (
        <IframePanel
          url={open.href}
          title={open.title}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
