import { useEffect, useRef, useState } from "react";
import { onPower, pressBreadboard } from "../lib/powerSurge";
import {
  bluetoothSupported,
  connectBoard,
  disconnectBoard,
  linkedBoard,
  setBoardLed,
} from "../lib/bluetoothLink";
import { musicPlaying, startMusic, stopMusic } from "../lib/musicBox";
import { dialAmbience, sweepAmbience } from "./SoftPot";
import { tone } from "../lib/tinySynth";
import styles from "../styles/StatusBar.module.css";

// tiny menu-bar row in the top right corner.
// clock, moon, ethernet and battery read the visitor's world,
// the power plug follows the breadboard cable, slow mode and the speaker
// are real switches. bluetooth wiggles the trinkets awake, and
// option-click on it pairs a real board (see lib/bluetoothLink).
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

// the trinkets in the collage are everything that isn't a card or photo
const findTrinkets = () => {
  let spot = document.querySelector("[data-power-hole]");
  while (spot && getComputedStyle(spot).position !== "absolute") {
    spot = spot.parentElement;
  }
  const collage = spot?.parentElement;
  if (!collage) return [];
  return [...collage.children].filter(
    (el) => !/cardSpot|photoItem/.test(String(el.className)),
  );
};

// each trinket gives a little shake, one after another, like pairing
const wiggle = (trinkets) => {
  const rate = document.documentElement.classList.contains("slow-mode")
    ? SLOW_RATE
    : 1;
  trinkets.forEach((el, i) => {
    const shake = el.animate(
      [
        { rotate: "0deg" },
        { rotate: "-7deg" },
        { rotate: "6deg" },
        { rotate: "-3deg" },
        { rotate: "0deg" },
      ],
      { duration: 520, delay: i * 90, easing: "ease-in-out" },
    );
    shake.playbackRate = rate;
  });
  return (520 + trinkets.length * 90) / rate;
};

const chirp = () => {
  tone(0, { freq: 880, to: 990, dur: 0.08, peak: 0.02 });
  tone(0.1, { freq: 1320, dur: 0.14, peak: 0.02 });
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

function Speaker({ playing }) {
  return (
    <svg {...icon}>
      <path d="M4 10v4h4l5 4V6L8 10z" />
      {playing && <path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11" />}
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
  const [playing, setPlaying] = useState(false);
  const [pairing, setPairing] = useState(null);
  const [board, setBoard] = useState(null);

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
      setBoardLed(on);
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

  // music and a paired board both outlive page changes, so pick them back up
  useEffect(() => {
    setPlaying(musicPlaying());
    setBoard(linkedBoard());
  }, []);

  const toggleMusic = () => {
    if (musicPlaying()) stopMusic();
    else startMusic();
    setPlaying(musicPlaying());
  };

  const pairTimers = useRef([]);
  useEffect(() => () => pairTimers.current.forEach(clearTimeout), []);

  const pairTrinkets = () => {
    pairTimers.current.forEach(clearTimeout);
    const trinkets = findTrinkets();
    chirp();
    if (!trinkets.length) {
      setPairing("no trinkets nearby");
    } else {
      setPairing("searching…");
      const done = wiggle(trinkets);
      pairTimers.current = [
        setTimeout(() => setPairing(`paired with ${trinkets.length} trinkets`), done),
      ];
    }
    pairTimers.current.push(setTimeout(() => setPairing(null), 4000));
  };

  // blinks the board's led on and off a few times as a hello
  const blinkBoardLed = (times) => {
    let on = false;
    let blinks = 0;
    const id = setInterval(() => {
      on = !on;
      setBoardLed(on);
      if (!on) blinks++;
      if (blinks >= times) {
        clearInterval(id);
        setBoardLed(false);
      }
    }, 220);
  };

  // option-click (alt-click) opens the browser's picker for a real board
  const pairBoard = async () => {
    if (linkedBoard()) {
      disconnectBoard();
      return;
    }
    try {
      setPairing("looking for a board…");
      const name = await connectBoard({
        onPress: pressBreadboard,
        onPot: dialAmbience,
        onDisconnect: () => setBoard(null),
      });
      setBoard(name);
      setPairing(null);
      chirp();
      sweepAmbience();
      blinkBoardLed(3);
    } catch {
      // picker closed or no board found
      setPairing("no board paired");
      setTimeout(() => setPairing(null), 2500);
    }
  };

  const clickBluetooth = (e) => {
    if (e.altKey && bluetoothSupported()) pairBoard();
    else pairTrinkets();
  };

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
        className={`${styles.btn} ${slow ? styles.on : ""}`}
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
      <button
        type="button"
        className={`${styles.btn} ${playing ? styles.on : ""}`}
        onClick={toggleMusic}
        aria-pressed={playing}
        aria-label="music"
        data-tip={playing ? "music: playing" : "music: off"}
      >
        <Speaker playing={playing} />
      </button>
      <button
        type="button"
        className={`${styles.btn} ${board ? styles.on : ""}`}
        onClick={clickBluetooth}
        aria-label="bluetooth"
        data-tip={
          pairing ||
          (board ? `bluetooth: connected to ${board}` : "bluetooth")
        }
      >
        <Bluetooth />
      </button>
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
