#include "SerialManager.h"


SerialManager::SerialManager() : baudRate(115200) {}

void SerialManager::begin(unsigned long baudRate) {
    this->baudRate = baudRate;
    Serial.begin(baudRate);
}

void SerialManager::sendData(const String& sensorName, float value) {
    Serial.print(sensorName);
    Serial.print(": ");
    Serial.println(value);
}

void SerialManager::sendData(const String& sensorName, int value) {
    Serial.print(sensorName);
    Serial.print(": ");
    Serial.println(value);
}

void SerialManager::sendRaw(const String& message) {
    Serial.println(message);
}
