#pragma once

#ifndef SERIAL_MANAGER_H
#define SERIAL_MANAGER_H

#include <Arduino.h>

class SerialManager {
public:
    SerialManager();
    void begin(unsigned long baudRate = 115200);
    void sendData(float temperature, int soilMoisture, int lightLevel);
    unsigned long baudRate;
};

#endif