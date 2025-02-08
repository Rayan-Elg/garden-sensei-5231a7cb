#include "LEDController.h"

LEDController::LEDController(int pinRed, int pinYellow, int pinGreen) : 
    pinRed(pinRed), pinYellow(pinYellow), pinGreen(pinGreen) {}

void LEDController::begin() {
    pinMode(pinRed, OUTPUT);
    pinMode(pinYellow, OUTPUT);
    pinMode(pinGreen, OUTPUT);
    digitalWrite(pinRed, LOW);
    digitalWrite(pinYellow, LOW);
    digitalWrite(pinGreen, LOW);
}

void LEDController::setLED(int pin) {
    digitalWrite(pinRed, LOW);
    digitalWrite(pinYellow, LOW);
    digitalWrite(pinGreen, LOW);
    digitalWrite(pin, HIGH);
}