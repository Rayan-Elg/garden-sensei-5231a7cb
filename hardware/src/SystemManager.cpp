#include "SystemManager.h"
#include <Arduino.h>

static const int BUTTON_OFF = 3000;
static const int FREQ_DATA = 3000;
static const long SENDING_DATA = 300000L;
static const int RED = 2;
static const int YELLOW = 1;
static const int GREEN = 0;

volatile bool SystemManager::isActive = false;
volatile unsigned long SystemManager::buttonPressTime = 0;
int SystemManager::buttonPin = 2;

SystemManager::SystemManager(SensorManager& sensorManager, LEDController& ledController, ButtonController& buttonController, SerialManager& serialManager) 
    : sensors(sensorManager), leds(ledController), button(buttonController), serial(serialManager), lastDataCollection(0), lastDataSend(0) {}

void SystemManager::begin() {
    sensors.begin();
    leds.begin();
    button.begin();
    serial.begin();
    buttonPin = button.getPin();
    attachInterrupt(digitalPinToInterrupt(buttonPin), handleButtonPress, CHANGE);
}

void SystemManager::handleButtonPress() {
    if (digitalRead(buttonPin) == LOW) {
        buttonPressTime = millis();
        return;
    } 
    unsigned long pressDuration = millis() - buttonPressTime;
    pressDuration >= BUTTON_OFF ? isActive = false : isActive = !isActive;
    if (isActive) { Serial.println("Starting collecting data"); }
}

void SystemManager::updateLEDStatus(float soilMoisture, float temperature) {
    if (soilMoisture < 30.0 || temperature < 10.0) {
        leds.setLED(RED);
    } else if (soilMoisture < 50.0 || temperature < 20.0) {
        leds.setLED(YELLOW);
    } else {
        leds.setLED(GREEN);
    }
}

void SystemManager::run() {
    if (!isActive) {
        return;
    };

    unsigned long currentMillis = millis();

    if (currentMillis - lastDataCollection >= FREQ_DATA) {
        lastDataCollection = currentMillis;
        float temperature = sensors.readTemperature();
        float soilMoisture = sensors.readSoilMoisture();
        float lightLevel = sensors.readLightLevel();

        updateLEDStatus(soilMoisture, temperature);

        // Temp print values
        Serial.print("Temperature: ");
        Serial.print(temperature);
        Serial.print(" °C, Soil Moisture: ");
        Serial.print(soilMoisture);
        Serial.print(" %, Light Level: ");
        Serial.print(lightLevel);
        Serial.println(" lux");
    }

    if (currentMillis - lastDataSend >= SENDING_DATA) {
        lastDataSend = currentMillis;
        float temperature = sensors.readTemperature();
        float soilMoisture = sensors.readSoilMoisture();
        float lightLevel = sensors.readLightLevel();
        serial.sendData(temperature, soilMoisture, lightLevel);
    }
}