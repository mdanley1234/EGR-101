#include <Wire.h>
#include "Adafruit_VEML7700.h"

Adafruit_VEML7700 veml = Adafruit_VEML7700();


const unsigned long READ_INTERVAL_MS = 200; // how often to sample (ms)
const float MAX_LUX_FOR_PWM = 100000.0; // map lux 0..MAX_LUX_FOR_PWM -> PWM 0..255

unsigned long lastRead = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) { delay(10); }
  Serial.println(F("VEML7700 --> Serial Plotter example"));

  if (!veml.begin()) {
    Serial.println(F("ERROR: VEML7700 not found."));
    while (1) { delay(1000); }
  }
  Serial.println(F("VEML7700 found."));
}

void loop() {
  unsigned long now = millis();
  if (now - lastRead < READ_INTERVAL_MS) return;
  lastRead = now;

  uint16_t rawALS = veml.readALS();// raw sensor 16-bit reading
  float lux = veml.readLux();// sensor's lux calculation

  // For the purpose of plotting we will map lux to a 0..255 PWM value linearly.
  float clampLux = lux;
  if (!isFinite(clampLux) || clampLux < 0) clampLux = 0;
  float normalized = clampLux / MAX_LUX_FOR_PWM;
  if (normalized > 1.0) normalized = 1.0;
  int pwmValue = (int)round(normalized * 255.0);
  if (pwmValue < 0) pwmValue = 0;
  if (pwmValue > 255) pwmValue = 255;

  // ---- Numeric line for Serial Plotter ----
  Serial.print(rawALS);
  Serial.print(' ');
  Serial.println(pwmValue);
}
