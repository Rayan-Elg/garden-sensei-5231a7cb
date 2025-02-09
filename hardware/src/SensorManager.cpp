#include "SensorManager.h"

SensorManager::SensorManager(int soilPin, int lightPin, int tempPin) 
    : soilMoisturePin(soilPin), lightSensorPin(lightPin), tempSensorPin(tempPin), dht(tempPin, DHT11) {}

void SensorManager::begin() {
    pinMode(soilMoisturePin, INPUT);
    pinMode(lightSensorPin, INPUT);
    pinMode(tempSensorPin, INPUT);
    dht.begin();
    delay(2000);
}

float SensorManager::readTemperature() {
    Serial.println("Lecture température DHT11...");
    float temp = dht.readTemperature();
    
    if (isnan(temp)) {
        Serial.println("❌ Erreur de lecture du capteur DHT11 !");
        return -1;
    }

    Serial.print("✅ Température lue : ");
    Serial.print(temp);
    Serial.println(" °C");
    
    return temp;
}


float SensorManager::readSoilMoisture() {
    int rawValue = analogRead(soilMoisturePin);
    Serial.print("Raw Soil Moisture Value: ");
    Serial.println(rawValue);
    return (rawValue / 1023.0) * 100.0; 
}


float SensorManager::readLightLevel() {
    int rawValue = analogRead(lightSensorPin);
    Serial.print("Raw Light Sensor Value: ");
    Serial.println(rawValue);
    return rawValue;
}
