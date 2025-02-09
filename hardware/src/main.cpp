#include "SystemManager.h"
#include "SensorManager.h"
#include "LEDController.h"
#include "ButtonController.h"
#include "SerialManager.h"

#define SOIL_MOISTURE_PIN A0
#define LIGHT_SENSOR_PIN A1
#define TEMP_SENSOR_PIN 6
#define BUTTON_PIN 3
#define LED_RED A3
#define LED_GREEN A4

SensorManager sensorManager(SOIL_MOISTURE_PIN, LIGHT_SENSOR_PIN, TEMP_SENSOR_PIN);
LEDController ledController(LED_RED, LED_GREEN);
ButtonController buttonController(BUTTON_PIN);
SerialManager serialManager;
SystemManager systemManager(sensorManager, ledController, buttonController, serialManager);

void setup() {
    systemManager.begin();
}

void loop() {
    systemManager.run();
}
