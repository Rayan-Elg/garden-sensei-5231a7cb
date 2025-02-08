#ifndef SYSTEM_MANAGER_H
#define SYSTEM_MANAGER_H

#include "SensorManager.h"
#include "LEDController.h"
#include "ButtonController.h"
#include "SerialManager.h"

class SystemManager {
public:
    SystemManager(SensorManager& sensorManager, LEDController& ledController, ButtonController& buttonController, SerialManager& serialManager);
    void begin();
    void run();
    static void handleButtonPress();

private:
    SensorManager& sensors;
    LEDController& leds;
    ButtonController& button;
    SerialManager& serial;
    static volatile bool isActive;
    static volatile unsigned long buttonPressTime;
    static int buttonPin;
    unsigned long lastDataCollection;
    unsigned long lastDataSend;
    void updateLEDStatus(float soilMoisture, float temperature);
};

#endif