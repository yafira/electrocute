// the real bluetooth link between the site and a little board on the desk.
// a press on the board's button presses the breadboard button on the page,
// the page's power state lights the board's led, and the pot on the
// breadboard sets the ambience (only while the circuit is on).
// web bluetooth only exists in chromium browsers, and only over https
// (or localhost). the browser shows its own picker, and only boards
// advertising this exact service ever show up in it.
// the matching arduino sketch lives in hardware/bluetooth-link.

export const SERVICE = "e45cde45-adaa-45d6-b354-1da6b4e3d719";
const BUTTON = "a7f5cdd1-0371-45c8-a54d-f7bc6f5af52c";
const LED = "d3fc0017-39ae-48e7-9ce3-9ac27bb49fc6";
const POT = "b1a6c3e2-4d5f-4e8a-9c7b-2f0e8d6a1c35";

let device = null;
let ledChar = null;

export const bluetoothSupported = () =>
  typeof navigator !== "undefined" && !!navigator.bluetooth;

export const linkedBoard = () =>
  device?.gatt?.connected ? device.name || "a board" : null;

export async function connectBoard({ onPress, onPot, onDisconnect }) {
  device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [SERVICE] }],
  });
  device.addEventListener("gattserverdisconnected", () => {
    device = null;
    ledChar = null;
    onDisconnect();
  });

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(SERVICE);
  const button = await service.getCharacteristic(BUTTON);
  ledChar = await service.getCharacteristic(LED);

  // the board only ever sends one byte, 1 for pressed. anything else is ignored
  await button.startNotifications();
  button.addEventListener("characteristicvaluechanged", (e) => {
    if (e.target.value.getUint8(0) === 1) onPress();
  });

  // older boards don't have the pot yet, so it's optional
  try {
    const pot = await service.getCharacteristic(POT);
    await pot.startNotifications();
    pot.addEventListener("characteristicvaluechanged", (e) => {
      // 0 to 1023, sent as 16 bits, low byte first
      onPot?.(e.target.value.getUint16(0, true));
    });
  } catch {
    // no pot on this board
  }

  return device.name || "a board";
}

export function disconnectBoard() {
  if (device?.gatt?.connected) device.gatt.disconnect();
}

export function setBoardLed(on) {
  if (!ledChar) return;
  ledChar.writeValue(Uint8Array.of(on ? 1 : 0)).catch(() => {});
}
