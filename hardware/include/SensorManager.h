#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Arduino.h>

class SensorManager {
public:
    SensorManager(int soilPin, int lightPin, int tempPin);
    void begin();
    float readTemperature();
    int readSoilMoisture();
    int readLightLevel();

private:
    int soilMoisturePin;
    int lightSensorPin;
};

#endif