import { useEffect, useState } from "react";
import { onPower } from "../lib/powerSurge";
import styles from "../styles/StatusBar.module.css";

// tiny menu-bar row in the top right corner.
// clock, moon, ethernet and battery read the visitor's world,
// the power plug follows the breadboard cable, slow mode is a real switch,
// bluetooth and headphones are just there for the look.
// battery only reports in chromium browsers, others get a full one.

const SLOW_KEY = "electrocute:slow";
const SLOW_RATE = 0.25;
// same delay the logo waits for the current to run up the cable
const CABLE_TRAVEL_MS = 380;

// a known new moon (jan 6 2000) and the length of one lunar cycle
const NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
const LUNAR_DAYS = 29.530588853;

const moonPhase = (date) => {
  const days = (date.getTime() - NEW_MOON) / 86400000;
  return (((days / LUNAR_DAYS) % 1) + 1) % 1;
};

const moonName = (p) => {
  if (p < 0.03 || p > 0.97) return "new moon";
  if (p < 0.22) return "waxing crescent";
  if (p < 0.28) return "first quarter";
  if (p < 0.47) return "waxing gibbous";
  if (p < 0.53) return "full moon";
  if (p < 0.72) return "waning gibbous";
  if (p < 0.78) return "last quarter";
  return "waning crescent";
};

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const formatDate = (date) =>
  date
    .toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
    .toLowerCase();

// slows every css animation and transition on the page to a crawl
const setSlow = (on) => {
  document.documentElement.classList.toggle("slow-mode", on);
  document
    .getAnimations()
    .forEach((a) => (a.playbackRate = on ? SLOW_RATE : 1));
};

const icon = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// lit part of the moon: outer edge plus the terminator ellipse
function Moon({ phase }) {
  const waxing = phase < 0.5;
  const gibbous = phase > 0.25 && phase < 0.75;
  // thin crescents get a little fuller so they still read at 18px
  const curve = 8 * Math.abs(Math.cos(2 * Math.PI * phase));
  const rx = gibbous ? curve : Math.min(curve, 5);
  const edge = waxing ? "A8 8 0 0 1 12 20" : "A8 8 0 0 0 12 20";
  const sweep = waxing === gibbous ? 1 : 0;
  const lit = phase > 0.03 && phase < 0.97;

  return (
    <svg {...icon}>
      <circle cx="12" cy="12" r="8" strokeWidth="1.4" opacity="0.5" />
      {lit && (
        <path
          d={`M12 4 ${edge} A${rx} 8 0 0 ${sweep} 12 4z`}
          fill="currentColor"
          stroke="none"
        />
      )}
    </svg>
  );
}

function Plug() {
  return (
    <svg {...icon}>
      <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />
    </svg>
  );
}

// rj45 jack, front view
function Ethernet() {
  return (
    <svg {...icon}>
      <path d="M4 6h16v10h-4v3H8v-3H4z" />
      <path d="M8.5 9v2M11 9v2M13.5 9v2M16 9v2" strokeWidth="1.6" />
    </svg>
  );
}

function Headphones() {
  return (
    <svg {...icon}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </svg>
  );
}

function Bluetooth() {
  return (
    <svg {...icon}>
      <path d="M7 7l10 10-5 5V2l5 5L7 17" />
    </svg>
  );
}

function Hourglass() {
  return (
    <svg {...icon}>
      <path d="M7 3h10M7 21h10M8 3c0 5 8 6 8 9s-8 4-8 9M16 3c0 5-8 6-8 9s8 4 8 9" />
    </svg>
  );
}

function Battery({ level, low }) {
  return (
    <svg width="28" height="13" viewBox="0 0 30 14" fill="none">
      <rect
        x="0.75"
        y="0.75"
        width="25"
        height="12.5"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect x="27.5" y="4.5" width="2" height="5" rx="1" fill="currentColor" />
      <rect
        className={low ? styles.low : undefined}
        x="3"
        y="3"
        width={Math.max(2, 20.5 * level)}
        height="8"
        rx="1.5"
        fill="currentColor"
      />
    </svg>
  );
}

export default function StatusBar() {
  const [now, setNow] = useState(null);
  const [online, setOnline] = useState(true);
  const [battery, setBattery] = useState({ level: 1, charging: false });
  const [hasCable, setHasCable] = useState(false);
  const [powered, setPowered] = useState(false);
  const [slow, setSlowState] = useState(false);

  // clock (and moon), ticks every second so the minute flips on time
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // "ethernet" is really just online / offline
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  // battery
  useEffect(() => {
    if (!navigator.getBattery) return;
    let b;
    const update = () => setBattery({ level: b.level, charging: b.charging });
    navigator.getBattery().then((res) => {
      b = res;
      update();
      b.addEventListener("levelchange", update);
      b.addEventListener("chargingchange", update);
    });
    return () => {
      if (!b) return;
      b.removeEventListener("levelchange", update);
      b.removeEventListener("chargingchange", update);
    };
  }, []);

  // power plug only shows where the breadboard cable is drawn
  useEffect(() => {
    const html = document.documentElement;
    const check = () => setHasCable(html.classList.contains("power-cable"));
    check();
    const watcher = new MutationObserver(check);
    watcher.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => watcher.disconnect();
  }, []);

  useEffect(() => {
    let timer;
    const off = onPower((on) => {
      clearTimeout(timer);
      timer = setTimeout(() => setPowered(on), CABLE_TRAVEL_MS);
    });
    return () => {
      off();
      clearTimeout(timer);
    };
  }, []);

  // slow mode, remembered across pages
  useEffect(() => {
    const on = localStorage.getItem(SLOW_KEY) === "on";
    setSlowState(on);
    setSlow(on);
  }, []);

  // anything that starts moving while slow mode is on gets slowed too
  useEffect(() => {
    if (!slow) return;
    const catchUp = (e) =>
      e.target.getAnimations?.().forEach((a) => (a.playbackRate = SLOW_RATE));
    document.addEventListener("animationstart", catchUp, true);
    document.addEventListener("transitionrun", catchUp, true);
    return () => {
      document.removeEventListener("animationstart", catchUp, true);
      document.removeEventListener("transitionrun", catchUp, true);
    };
  }, [slow]);

  const toggleSlow = () => {
    const next = !slow;
    localStorage.setItem(SLOW_KEY, next ? "on" : "off");
    setSlowState(next);
    setSlow(next);
  };

  const low = battery.level <= 0.2 && !battery.charging;
  const percent = Math.round(battery.level * 100);
  const phase = now ? moonPhase(now) : 0.5;

  return (
    <div className={styles.StatusBar}>
      <button
        type="button"
        className={`${styles.slow} ${slow ? styles.on : ""}`}
        onClick={toggleSlow}
        aria-pressed={slow}
        aria-label="slow mode"
        data-tip={slow ? "slow mode: on" : "slow mode: off"}
      >
        <Hourglass />
      </button>
      <span data-tip={moonName(phase)}>
        <Moon phase={phase} />
      </span>
      {hasCable && (
        <span
          className={powered ? styles.on : styles.off}
          data-tip={powered ? "powered" : "power off"}
        >
          <Plug />
        </span>
      )}
      <span
        className={online ? undefined : styles.off}
        data-tip={online ? "connected via ethernet" : "ethernet unplugged"}
      >
        <Ethernet />
      </span>
      <span data-tip="headphones">
        <Headphones />
      </span>
      <span data-tip="bluetooth">
        <Bluetooth />
      </span>
      <span data-tip={`battery ${percent}%${battery.charging ? ", charging" : ""}`}>
        <Battery level={battery.level} low={low} />
      </span>
      <span
        className={styles.time}
        data-tip={now ? formatDate(now) : undefined}
      >
        {now && formatTime(now)}
      </span>
    </div>
  );
}
