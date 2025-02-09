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
    Serial.println("🌡️ Lecture température DHT11...");
    float temp = dht.readTemperature();
    
    if (isnan(temp) || temp < -10.0 || temp > 60.0) {
        Serial.println("❌ Erreur de lecture !");
        return -1;
    }

    Serial.print("✅ Température : ");
    Serial.print(temp);
    Serial.println(" °C");
    
    return temp;
}

float SensorManager::readSoilMoisture() {
    float moisture = 100.0 - ((analogRead(soilMoisturePin) / 1023.0) * 100.0);
    moisture = constrain(moisture, 0.0, 100.0);

    Serial.print("💧 Humidité du sol : ");
    Serial.print(moisture);
    Serial.println(" %");

    return moisture;
}

float SensorManager::readLightLevel() {
    float rawValue = analogRead(lightSensorPin);
    float lux = (1 - (rawValue / 1023.0)) * 100.0;
    lux = constrain(lux, 0.0, 100.0);

    Serial.print("🔆 Lumière : ");
    Serial.print(lux);
    Serial.println(" %");
    Serial.println("-----------------------------");

    return lux;
}