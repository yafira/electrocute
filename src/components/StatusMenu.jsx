import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import projects from "../data/projects";
import styles from "../styles/StatusBar.module.css";

// the left side of the menu bar, like a mac.
// the flower is the apple menu with the main links,
// and "files" opens every project as a list.
// once one menu is open, hovering the other one switches to it.

const mainLinks = [
  { title: "about", href: "/about" },
  { title: "blog", href: "https://blog.electrocute.io/" },
  { title: "contact", href: "/contact" },
  { title: "shop", href: "/craftcomputery" },
];

// internal pages use next's link, outside sites open in a new tab
function MenuLink({ href, onPick, children }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" role="menuitem" onClick={onPick}>
        {children}
        <span className={styles.arrow}>↗</span>
      </a>
    );
  }
  return (
    <Link href={href} role="menuitem" onClick={onPick}>
      {children}
    </Link>
  );
}

export default function StatusMenu() {
  const [open, setOpen] = useState(null);
  const barRef = useRef(null);
  const close = () => setOpen(null);

  // close on a click outside or escape
  useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (!barRef.current?.contains(e.target)) setOpen(null);
    };
    const esc = (e) => e.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const trigger = (name) => ({
    onClick: () => setOpen(open === name ? null : name),
    onPointerEnter: () => open && setOpen(name),
    "aria-expanded": open === name,
    "aria-haspopup": "menu",
  });

  return (
    <div className={styles.StatusMenu} ref={barRef}>
      <span className={styles.menuSpot}>
        <button
          type="button"
          className={`${styles.btn} ${styles.flowerBtn} ${open === "flower" ? styles.open : ""}`}
          aria-label="electrocute lab"
          {...trigger("flower")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/flower.png" alt="" width={18} height={18} />
        </button>
        {open === "flower" && (
          <ul className={styles.menu} role="menu" aria-label="electrocute lab">
            <li className={styles.menuLabel} role="presentation">
              electrocute lab
            </li>
            {mainLinks.map((l) => (
              <li key={l.title} role="none">
                <MenuLink href={l.href} onPick={close}>
                  <span>{l.title}</span>
                </MenuLink>
              </li>
            ))}
          </ul>
        )}
      </span>

      <span className={styles.menuSpot}>
        <button
          type="button"
          className={`${styles.btn} ${styles.menuWord} ${open === "files" ? styles.open : ""}`}
          {...trigger("files")}
        >
          files
        </button>
        {open === "files" && (
          <ul className={styles.menu} role="menu" aria-label="all projects">
            <li className={styles.menuLabel} role="presentation">
              all projects
            </li>
            {projects.map((p) => (
              <li key={p.slug} role="none">
                <MenuLink href={p.href} onPick={close}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.icon} alt="" width={16} height={16} />
                  <span>{p.title}</span>
                </MenuLink>
              </li>
            ))}
          </ul>
        )}
      </span>
    </div>
  );
}
