#ifndef BUTTON_CONTROLLER_H
#define BUTTON_CONTROLLER_H

class ButtonController {
public:
    ButtonController(int pin);
    void begin();
    bool isPressed(); // Vérifie si le bouton est pressé
private:
    int buttonPin;
};

#endif
