#include "SensorManager.h"

SensorManager::SensorManager(int soilPin, int lightPin, int tempPin) 
    : soilMoisturePin(soilPin), lightSensorPin(lightPin), tempSensorPin(tempPin) {}

void SensorManager::begin() {
    pinMode(soilMoisturePin, INPUT);
    pinMode(lightSensorPin, INPUT);
    pinMode(tempSensorPin, INPUT);
}

float SensorManager::readTemperature() {
    int rawValue = analogRead(tempSensorPin);
    float voltage = (rawValue / 1023.0) * 5.0;
    return (voltage - 0.5) * 100.0;
}

float SensorManager::readSoilMoisture() {
    int rawValue = analogRead(soilMoisturePin);
    return 100.0 - ((rawValue / 1023.0) * 100.0);
}

float SensorManager::readLightLevel() {
    int rawValue = analogRead(lightSensorPin);
    float voltage = (rawValue / 1023.0) * 5.0;
    return voltage * 500.0;
}