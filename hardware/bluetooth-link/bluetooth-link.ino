// bluetooth link for electrocute.io
// a button on the desk presses the breadboard button on the site,
// and the site's power state lights the led.
// needs the ArduinoBLE library and a board it supports:
// nano 33 ble, nano esp32, nano rp2040 connect, uno r4 wifi.
// wiring: button between pin 2 and gnd, led is the built-in one.
// pair it from the site: option-click the bluetooth icon in chrome.

#include <ArduinoBLE.h>

// these have to match src/lib/bluetoothLink.js
BLEService link("e45cde45-adaa-45d6-b354-1da6b4e3d719");
BLEByteCharacteristic button("a7f5cdd1-0371-45c8-a54d-f7bc6f5af52c", BLERead | BLENotify);
BLEByteCharacteristic led("d3fc0017-39ae-48e7-9ce3-9ac27bb49fc6", BLERead | BLEWrite);

const int BUTTON_PIN = 2;
bool wasPressed = false;

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
  BLE.addService(link);

  button.writeValue(0);
  led.writeValue(0);
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
}
