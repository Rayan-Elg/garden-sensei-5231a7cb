#ifndef SYSTEM_MANAGER_H
#define SYSTEM_MANAGER_H

#include "SensorManager.h"
#include "LEDController.h"
#include "ButtonController.h"

class SystemManager {
public:
    SystemManager();
    void begin();
    void run(); // Exécute le cycle principal une fois le bouton pressé
};

#endif
