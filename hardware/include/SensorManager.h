#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

class SensorManager {
public:
    SensorManager(); // Constructeur
    void begin(); // Initialise les capteurs
    float readTemperature(); // Retourne la température
    float readHumidity(); // Retourne l'humidité
    int readSoilMoisture(); // Retourne l'humidité du sol
    int readLightLevel(); // Retourne le niveau de lumière
};

#endif
