#pragma once

#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Arduino.h>

class SensorManager {
public:
    SensorManager(int soilPin, int lightPin, int tempSensorPin);
    void begin();
    float readTemperature();
    float readSoilMoisture();
    float readLightLevel();
    int soilMoisturePin, lightSensorPin, tempSensorPin;
};

#endif