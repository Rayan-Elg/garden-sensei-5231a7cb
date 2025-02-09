#include "SystemManager.h"
#include <Arduino.h>

static const int BUTTON_OFF = 3000;
static const int FREQ_DATA = 3000;
static const long SENDING_DATA = 300000L;

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
    isActive = false;
    attachInterrupt(digitalPinToInterrupt(buttonPin), handleButtonPress, CHANGE);
}

void SystemManager::handleButtonPress() {
    static unsigned long lastInterruptTime = 0;
    unsigned long interruptTime = millis();
    
    if (interruptTime - lastInterruptTime < 300) {
        return;
    }
    lastInterruptTime = interruptTime;
    Serial.println("🔘 Bouton pressé !");

    if (digitalRead(buttonPin) == LOW) {
        buttonPressTime = millis();
        return;
    }

    unsigned long pressDuration = millis() - buttonPressTime;

    if (!isActive) {
        isActive = true;
        Serial.println("✅ System Started");
    } else if (pressDuration >= BUTTON_OFF) {
        isActive = false;
        Serial.println("🛑 System Stopped");
    }
}




void SystemManager::updateLEDStatus(float soilMoisture, float temperature, float lightLevel) {
    const float MOISTURE_CRITICAL = 20.0;
    const float TEMP_CRITICAL     = 5.0;
    const float LIGHT_CRITICAL    = 5.0;

    bool isCritical = (soilMoisture < MOISTURE_CRITICAL) || 
                      (temperature < TEMP_CRITICAL) || 
                      (lightLevel < LIGHT_CRITICAL);

    
    if (isCritical) {
        leds.setLED(leds.pinRed);
        Serial.println("🚨 ALERTE CRITIQUE: Conditions dangereuses !");
    } else {
        leds.setLED(leds.pinGreen);
        Serial.println("✅ Conditions normales.");
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

        updateLEDStatus(soilMoisture, temperature, lightLevel);
    }

    if (currentMillis - lastDataSend >= SENDING_DATA) {
        lastDataSend = currentMillis;
        float temperature = sensors.readTemperature();
        float soilMoisture = sensors.readSoilMoisture();
        float lightLevel = sensors.readLightLevel();
        serial.sendData(temperature, soilMoisture, lightLevel);
    }
}
