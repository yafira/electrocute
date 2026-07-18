// the project index box: every project is a small index card
// pulled from src/data/projects.js. hover a card and it lifts
// slightly out of the box, running stitch showing along its edge.
// external projects open in a little floating window right on the
// page instead of a new tab; the site's own pages still navigate.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import projects from "../data/projects";
import IframePanel from "./IframePanel";

export default function Container() {
  const [open, setOpen] = useState(null); // { href, title } | null

  return (
    <div className={styles.container}>
      <div className={styles.projectGrid}>
        {projects.map((project, i) => {
          const external = project.href.startsWith("http");
          const cardStyle = {
            "--bg": project.tint,
            "--hover-bg": project.hoverBg,
            "--hover-border": project.hoverBorder,
            "--tilt": `${(i % 3) - 1}deg`,
          };
          const cardContent = (
            <>
              <span className={styles.cardTop}>
                <Image
                  className={styles.logo}
                  src={project.icon}
                  alt=""
                  width={44}
                  height={44}
                />
                <h3>{project.title}</h3>
              </span>
              <span className={styles.rule} aria-hidden="true" />
              <p>{project.blurb}</p>
            </>
          );

          if (external) {
            return (
              <button
                key={project.slug}
                type="button"
                className={styles.card}
                style={cardStyle}
                onClick={() =>
                  setOpen({ href: project.href, title: project.title })
                }
              >
                {cardContent}
              </button>
            );
          }

          return (
            <Link
              key={project.slug}
              href={project.href}
              className={styles.card}
              style={cardStyle}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>

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
