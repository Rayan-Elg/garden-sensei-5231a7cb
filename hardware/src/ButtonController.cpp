#include "ButtonController.h"

ButtonController::ButtonController(int pin) : buttonPin(pin) {}

void ButtonController::begin() {
    pinMode(buttonPin, INPUT_PULLUP);
}

bool ButtonController::isPressed() {
    return digitalRead(buttonPin) == LOW;
}

int ButtonController::getPin() {
    return buttonPin;
}
