#include "SerialManager.h"

SerialManager::SerialManager() : baudRate(115200) {}

void SerialManager::begin(unsigned long baudRate) {
    this->baudRate = baudRate;
    Serial.begin(baudRate);
}

void SerialManager::sendData(float temperature, float humidity, int soilMoisture, int lightLevel) {
    Serial.print("{");
    Serial.print("\"temperature\": "); Serial.print(temperature);
    Serial.print(", \"humidity\": "); Serial.print(humidity);
    Serial.print(", \"soilMoisture\": "); Serial.print(soilMoisture);
    Serial.print(", \"lightLevel\": "); Serial.print(lightLevel);
    Serial.println("}");
}
