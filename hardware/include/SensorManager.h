#pragma once

#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Arduino.h>
#include "DHT.h"

class SensorManager {
public:
    SensorManager(int soilPin, int lightPin, int tempSensorPin);
    void begin();
    float readTemperature();
    float readSoilMoisture();
    float readLightLevel();

private:
    int soilMoisturePin, lightSensorPin, tempSensorPin;
    DHT dht;
};

#endif
