// the project index box: every project is a small index card
// pulled from src/data/projects.js. hover a card and it lifts
// slightly out of the box, running stitch showing along its edge.

import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import projects from "../data/projects";

export default function Container() {
  return (
    <div className={styles.container}>
      <div className={styles.projectGrid}>
        {projects.map((project, i) => {
          const external = project.href.startsWith("http");
          return (
            <Link
              key={project.slug}
              href={project.href}
              className={styles.card}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              style={{
                "--bg": project.tint,
                "--hover-bg": project.hoverBg,
                "--hover-border": project.hoverBorder,
                "--tilt": `${(i % 3) - 1}deg`,
              }}
            >
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
