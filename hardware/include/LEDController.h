#pragma once

#ifndef LED_CONTROLLER_H
#define LED_CONTROLLER_H

#include <Arduino.h>

class LEDController {
public:
    LEDController(int pinRed, int pinYellow, int pinGreen);
    void begin();
    void setLED(int pin);
    int pinRed, pinYellow, pinGreen;
};

#endif
