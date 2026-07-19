// the receipt guestbook: leave a note and it prints onto a little
// thermal receipt, newest at the bottom, like it just came off the
// printer. shared via /api/notes; without a backend, notes stay on
// this device only.

import { useEffect, useRef, useState } from "react";
import { BloomOutline } from "electrocute-ui";
import styles from "../styles/Receipt.module.css";

const LOCAL_NOTES_KEY = "electrocute:receipt:notes";
const SIGNED_KEY = "electrocute:receipt:signed";

function stamp(ts) {
  const d = new Date(ts);
  return d
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, ".");
}

export default function Receipt() {
  const [notes, setNotes] = useState(null);
  const [shared, setShared] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [signed, setSigned] = useState(false);
  const paperRef = useRef(null);

  useEffect(() => {
    setSigned(Boolean(localStorage.getItem(SIGNED_KEY)));
    let alive = true;
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data.shared && Array.isArray(data.notes)) {
          setShared(true);
          setNotes(data.notes);
        } else {
          setNotes(JSON.parse(localStorage.getItem(LOCAL_NOTES_KEY) || "[]"));
        }
      })
      .catch(() => {
        if (alive)
          setNotes(JSON.parse(localStorage.getItem(LOCAL_NOTES_KEY) || "[]"));
      });
    return () => {
      alive = false;
    };
  }, []);

  const submit = async () => {
    const trimmed = note.trim();
    if (!trimmed || busy || signed) return;
    setBusy(true);

    if (shared) {
      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, note: trimmed }),
        });
        const data = await res.json();
        if (Array.isArray(data.notes)) setNotes(data.notes);
      } catch {
        // note lost in the mail; let them try again
        setBusy(false);
        return;
      }
    } else {
      const next = [
        ...(notes || []),
        {
          name: name.trim().slice(0, 24) || "anonymous visitor",
          note: trimmed.slice(0, 140),
          ts: Date.now(),
        },
      ].slice(-30);
      localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(next));
      setNotes(next);
    }

    localStorage.setItem(SIGNED_KEY, "1");
    setSigned(true);
    setNote("");
    setName("");
    setBusy(false);
    // bring the fresh print into view at the bottom of the paper
    requestAnimationFrame(() => {
      if (paperRef.current)
        paperRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  const shown = notes || [];

  return (
    <section className={styles.wrap}>
      <h2>
        guest receipt{" "}
        <BloomOutline
          size="sm"
          color="#f2b9e0"
          style={{ width: "12px", height: "12px" }}
        />
      </h2>
      <p className={styles.hint}>
        leave a little note and it prints below. one per visitor, 140
        characters.
      </p>

      <div className={styles.printer}>
        <div className={styles.slot} aria-hidden="true" />
        <div className={styles.paper} ref={paperRef}>
          <p className={styles.receiptHeader}>
            electrocute lab
            <br />
            visitor log · nyc & the web
            {shown.length > 0 && (
              <>
                <br />
                notes printed: {shown.length}
              </>
            )}
            <br />
            ································
          </p>
          {notes === null && <p className={styles.line}>warming up printer…</p>}
          {notes !== null && shown.length === 0 && (
            <p className={styles.line}>
              no notes yet. yours could be the first.
            </p>
          )}
          {shown.map((n, i) => (
            <p
              className={`${styles.line} ${
                i === shown.length - 1 ? styles.fresh : ""
              }`}
              key={`${n.ts}-${i}`}
            >
              <span className={styles.meta}>
                {stamp(n.ts)} · {n.name}
              </span>
              {n.note}
            </p>
          ))}
          <p className={styles.receiptFooter}>
            ································
            <br />
            thank you for visiting
            <br />
            come back soon
          </p>
        </div>
        <div className={styles.tear} aria-hidden="true" />
      </div>

      {signed ? (
        <p className={styles.signedNote}>your note is on the receipt</p>
      ) : (
        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="name (optional)"
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="your name, optional"
          />
          <textarea
            className={styles.textarea}
            placeholder="your note…"
            maxLength={140}
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            aria-label="your note"
          />
          <div className={styles.formFooter}>
            <span className={styles.counter}>{140 - note.length}</span>
            <button
              type="button"
              className={styles.print}
              onClick={submit}
              disabled={!note.trim() || busy}
            >
              {busy ? "printing…" : "print note"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
