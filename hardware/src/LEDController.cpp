#include "LEDController.h"

LEDController::LEDController(int pinRed, int pinGreen) : 
    pinRed(pinRed), pinGreen(pinGreen) {}

void LEDController::begin() {
    pinMode(pinRed, OUTPUT);
    pinMode(pinGreen, OUTPUT);
    digitalWrite(pinRed, LOW);
    digitalWrite(pinGreen, HIGH);
}

void LEDController::setLED(int pin) {
    digitalWrite(pinRed, LOW);
    digitalWrite(pinGreen, LOW);
    digitalWrite(pin, HIGH);
}