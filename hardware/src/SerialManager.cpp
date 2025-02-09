#include "SerialManager.h"

SerialManager::SerialManager() : baudRate(115200) {}

void SerialManager::begin(unsigned long baudRate) {
    this->baudRate = baudRate;
    Serial.begin(baudRate);
    Serial.println("Serial communication initialized!"); 
}

void SerialManager::sendData(float temperature, int soilMoisture, int lightLevel) {
    if (!Serial) return;

    Serial.println("📡 Envoi des données..."); // Message de confirmation d'envoi

    Serial.print("{\"type\": \"sendData\", ");
    Serial.print("\"temperature\": "); Serial.print(temperature);
    Serial.print(", \"soilMoisture\": "); Serial.print(soilMoisture);
    Serial.print(", \"lightLevel\": "); Serial.print(lightLevel);
    Serial.println("}");
}

