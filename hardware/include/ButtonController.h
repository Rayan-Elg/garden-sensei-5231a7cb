#pragma once

#ifndef BUTTON_CONTROLLER_H
#define BUTTON_CONTROLLER_H

#include <Arduino.h>

class ButtonController {
public:
    ButtonController(int pin);
    void begin();
    bool wasPressed();
    int getPin();

private:
    int buttonPin;
    static volatile bool buttonPressed;
    static void handleInterrupt();
};

#endif