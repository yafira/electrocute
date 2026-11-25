// bluetooth link for electrocute.io
// a button on the desk presses the breadboard button on the site,
// the site's power state lights the led, and the pot on the
// breadboard sets the site's ambience.
// needs the ArduinoBLE library and a board it supports:
// nano 33 ble, nano esp32, nano rp2040 connect, uno r4 wifi.
// wiring: button between pin 2 and gnd, led is the built-in one.
// pot: outer legs to 5v and gnd, middle leg to A0.
// pair it from the site: option-click the bluetooth icon in chrome.

#include <ArduinoBLE.h>

// these have to match src/lib/bluetoothLink.js
BLEService link("e45cde45-adaa-45d6-b354-1da6b4e3d719");
BLEByteCharacteristic button("a7f5cdd1-0371-45c8-a54d-f7bc6f5af52c", BLERead | BLENotify);
BLEByteCharacteristic led("d3fc0017-39ae-48e7-9ce3-9ac27bb49fc6", BLERead | BLEWrite);
BLEUnsignedShortCharacteristic pot("b1a6c3e2-4d5f-4e8a-9c7b-2f0e8d6a1c35", BLERead | BLENotify);

const int BUTTON_PIN = 2;
const int POT_PIN = A0;
bool wasPressed = false;
int lastPot = -1;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);

  if (!BLE.begin()) {
    // no radio, blink fast forever
    while (true) {
      digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
      delay(100);
    }
  }

  BLE.setLocalName("electrocute");
  BLE.setAdvertisedService(link);
  link.addCharacteristic(button);
  link.addCharacteristic(led);
  link.addCharacteristic(pot);
  BLE.addService(link);

  button.writeValue(0);
  led.writeValue(0);
  pot.writeValue(0);
  BLE.advertise();
}

void loop() {
  BLE.poll();

  // send 1 on press and 0 on release, with a tiny debounce
  bool pressed = digitalRead(BUTTON_PIN) == LOW;
  if (pressed != wasPressed) {
    button.writeValue(pressed ? 1 : 0);
    wasPressed = pressed;
    delay(30);
  }

  // the site writes 1 when powered, 0 when not
  if (led.written()) {
    digitalWrite(LED_BUILTIN, led.value() ? HIGH : LOW);
  }

  // send the pot only when it really moved, so the radio stays quiet
  int v = analogRead(POT_PIN);
  if (abs(v - lastPot) >= 4) {
    pot.writeValue((uint16_t)v);
    lastPot = v;
  }

  delay(20);
}
