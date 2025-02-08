#ifndef SERIAL_MANAGER_H
#define SERIAL_MANAGER_H

#include <Arduino.h>

class SerialManager {
public:
    SerialManager();
    void begin(unsigned long baudRate = 115200);
    void sendData(float temperature, float humidity, int soilMoisture, int lightLevel);
    
private:
    unsigned long baudRate;
};

#endif