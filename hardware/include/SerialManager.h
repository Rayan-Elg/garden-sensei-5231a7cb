#ifndef SERIAL_MANAGER_H
#define SERIAL_MANAGER_H

#include <Arduino.h>

class SerialManager {
public:
    SerialManager();
    void begin(unsigned long baudRate = 115200);
    void sendData(const String& sensorName, float value);
    void sendData(const String& sensorName, int value);
    void sendRaw(const String& message);
    
private:
    unsigned long baudRate;
};

#endif