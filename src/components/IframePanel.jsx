import { useEffect, useRef, useState } from "react";
import styles from "../styles/IframePanel.module.css";

const BLOCKED = ["figma.com", "wordpress.com"];

export function isEmbeddable(url) {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return !BLOCKED.some((d) => host.includes(d));
  } catch {
    return false;
  }
}

export function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches
  );
}

// shared click handler for every project card / photo / preview that
// opens an external link. opens the floating window (full-screen on
// mobile), except sites that refuse to be framed, which skip the
// dead-end "can't be embedded" panel on mobile and go straight to a
// new tab. must be called directly from the click handler so
// window.open stays inside the user gesture (popup blockers).
//
// `size` is optional — { w, h } in px — for embeds that need a
// non-default panel size (e.g. Ko-fi's compact widget, which looks
// lost in the normal 780x600 default). omit it for the normal size.
//
// `externalUrl` is optional — use it when the URL that should load
// IN the iframe differs from the URL the "open in new tab" button
// and url bar should point to (e.g. Ko-fi: the iframe needs the
// widget/embed query params, but "open in new tab" should go to the
// plain profile page). omit it and both just use `href`.
export function openProject(href, title, setOpen, size, externalUrl) {
  if (!isEmbeddable(href) && isMobileViewport()) {
    window.open(externalUrl || href, "_blank", "noopener,noreferrer");
  } else {
    setOpen({ href, title, size, externalUrl });
  }
}

export default function IframePanel({
  url,
  title,
  onClose,
  size,
  externalUrl,
}) {
  const displayUrl = externalUrl || url;
  const loadingRef = useRef(null);
  const windowRef = useRef(null);
  const dragState = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const w = Math.min(size?.w ?? 780, window.innerWidth - 48);
    const h = Math.min(size?.h ?? 600, window.innerHeight - 80);
    setPos({
      x: Math.round((window.innerWidth - w) / 2),
      y: Math.round((window.innerHeight - h) / 4),
      w,
      h,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.w, size?.h]);

  const onTitleBarMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const rect = windowRef.current.getBoundingClientRect();
    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: rect.left,
      startY: rect.top,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startMouseX;
    const dy = e.clientY - dragState.current.startMouseY;
    setPos((prev) => ({
      ...prev,
      x: Math.max(0, dragState.current.startX + dx),
      y: Math.max(0, dragState.current.startY + dy),
    }));
  };

  const onMouseUp = () => {
    dragState.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const onTitleBarTouchStart = (e) => {
    if (isMobileViewport()) return; // full-screen on mobile, nothing to drag
    const touch = e.touches[0];
    const rect = windowRef.current.getBoundingClientRect();
    dragState.current = {
      startMouseX: touch.clientX,
      startMouseY: touch.clientY,
      startX: rect.left,
      startY: rect.top,
    };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (!dragState.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragState.current.startMouseX;
    const dy = touch.clientY - dragState.current.startMouseY;
    setPos((prev) => ({
      ...prev,
      x: Math.max(0, dragState.current.startX + dx),
      y: Math.max(0, dragState.current.startY + dy),
    }));
  };

  const onTouchEnd = () => {
    dragState.current = null;
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  };

  const handleLoad = () => {
    if (loadingRef.current) loadingRef.current.style.opacity = "0";
  };

  const windowStyle =
    pos && !isMobileViewport()
      ? { left: pos.x, top: pos.y, width: pos.w, height: pos.h }
      : {};

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={windowRef} className={styles.window} style={windowStyle}>
        <div
          className={styles.titleBar}
          onMouseDown={onTitleBarMouseDown}
          onTouchStart={onTitleBarTouchStart}
        >
          <div className={styles.titleBarLeft}>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="close"
              title="close"
            >
              <span className={styles.closeDot} />
            </button>
          </div>
          <span className={styles.windowTitle}>{title}</span>
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalBtn}
            title="open in new tab"
            onMouseDown={(e) => e.stopPropagation()}
          >
            open&nbsp;↗
          </a>
        </div>

        <div className={styles.urlBar}>
          <span className={styles.urlText}>{displayUrl}</span>
        </div>

        <div className={styles.body}>
          {isEmbeddable(url) ? (
            <>
              <div ref={loadingRef} className={styles.loading}>
                loading<span className={styles.dots}>...</span>
              </div>
              <iframe
                src={url}
                title={title}
                className={styles.iframe}
                onLoad={handleLoad}
                allow="fullscreen"
              />
            </>
          ) : (
            <div className={styles.blocked}>
              <p>this page can&apos;t be embedded.</p>
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.blockedLink}
              >
                open in new tab ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
