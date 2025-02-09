#include "ButtonController.h"

volatile bool ButtonController::buttonPressed = false;

ButtonController::ButtonController(int pin) : buttonPin(pin) {}

void ButtonController::begin() {
    pinMode(buttonPin, INPUT_PULLUP);
    attachInterrupt(digitalPinToInterrupt(buttonPin), handleInterrupt, FALLING);
}

bool ButtonController::wasPressed() {
    if (buttonPressed) {
        buttonPressed = false;
        return true;
    }
    return false;
}

void ButtonController::handleInterrupt() {
    buttonPressed = true;
}

int ButtonController::getPin() {
    return buttonPin;
}