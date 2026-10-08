// a tiny event bus for the power cable that runs from the breadboard
// up into the logo. the breadboard lives inside the collage and the
// logo lives in the header, so instead of threading props through
// the page they talk over a window event.

const EVENT = "electrocute:power";

// on: true when the button just switched power on, false when it cut it
export function sendPower(on) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { on } }));
}

export function onPower(handler) {
  if (typeof window === "undefined") return () => {};
  const listener = (event) => handler(event.detail.on);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
