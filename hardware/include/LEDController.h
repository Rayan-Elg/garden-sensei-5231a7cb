#ifndef LED_CONTROLLER_H
#define LED_CONTROLLER_H

class LEDController {
public:
    LEDController(int pinRed, int pinYellow, int pinGreen);
    void begin();
    void setStatus(int status); // Définit la couleur de la LED en fonction de l'état
private:
    int pinRed, pinYellow, pinGreen;
};

#endif
