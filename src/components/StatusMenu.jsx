import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import projects from "../data/projects";
import styles from "../styles/StatusBar.module.css";

// the left side of the menu bar.
// the flower opens every project as a list, like the apple menu,
// and next to it each visitor gets their own number, kept on their device
// so it stays the same when they come back.

const VISITOR_KEY = "electrocute:visitor";

export default function StatusMenu() {
  const [open, setOpen] = useState(false);
  const [visitor, setVisitor] = useState(null);
  const menuRef = useRef(null);

  // count each browser once, then remember its number
  useEffect(() => {
    const saved = Number(localStorage.getItem(VISITOR_KEY));
    if (saved) {
      setVisitor(saved);
      return;
    }
    fetch("/api/visitors", { method: "POST" })
      .then((res) => res.json())
      .then(({ count }) => {
        if (!count) return;
        localStorage.setItem(VISITOR_KEY, String(count));
        setVisitor(count);
      })
      .catch(() => {});
  }, []);

  // close on a click outside or escape
  useEffect(() => {
    if (!open) return;
    const away = (e) => {
      if (!menuRef.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className={styles.StatusMenu} ref={menuRef}>
      <button
        type="button"
        className={`${styles.btn} ${styles.flowerBtn} ${open ? styles.open : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="all projects"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/flower.png" alt="" width={18} height={18} />
      </button>

      {visitor && (
        <span
          className={styles.visitor}
          data-tip={`you're visitor no. ${visitor.toLocaleString()}`}
        >
          visitor no. {visitor.toLocaleString()}
        </span>
      )}

      {open && (
        <ul className={styles.menu} role="menu" aria-label="all projects">
          <li className={styles.menuLabel} role="presentation">
            all projects
          </li>
          {projects.map((p) => {
            const external = p.href.startsWith("http");
            const row = (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.icon} alt="" width={16} height={16} />
                <span>{p.title}</span>
                {external && <span className={styles.arrow}>↗</span>}
              </>
            );
            return (
              <li key={p.slug} role="none">
                {external ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    {row}
                  </a>
                ) : (
                  <Link href={p.href} role="menuitem" onClick={() => setOpen(false)}>
                    {row}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
