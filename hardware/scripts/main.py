import os
import serial
import json
import requests
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

# Configuration Supabase - Load from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
PLANT_ID = os.getenv("PLANT_ID", "your-plant-id-here")

# SMS Configuration - Load from environment variables  
SMS_API_KEY = os.getenv("SMS_API_KEY")
PHONE_NUMBER = os.getenv("PHONE_NUMBER")

# Validate required environment variables
if not SUPABASE_URL or not SUPABASE_API_KEY:
    print("❌ Erreur : Variables d'environnement SUPABASE manquantes. Vérifiez le fichier .env.")
    print("   Requis: SUPABASE_URL, SUPABASE_API_KEY")
    exit(1)

if not SMS_API_KEY or not PHONE_NUMBER:
    print("❌ Erreur : Variables d'environnement SMS manquantes. Vérifiez le fichier .env.")
    print("   Requis: SMS_API_KEY, PHONE_NUMBER")
    exit(1)

# Build the patch URL dynamically
SUPABASE_PATCH_URL = f"{SUPABASE_URL}?id=eq.{PLANT_ID}"

TEMP_CRITICAL = 3.0
MOISTURE_CRITICAL = 15.0
LIGHT_CRITICAL = 5.0
critical_state = False

def send_to_supabase(temperature, soil_moisture, light_level):
    """ Envoie les données formatées à Supabase """
    payload = {
        "moisture": max(0, min(soil_moisture, 100)),
        "light": max(0, min(light_level, 100)),
        "temperature": max(-50, min(temperature, 100))
    }

    headers = {
        "Content-Type": "application/json",
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}"
    }

    response = requests.patch(SUPABASE_URL, json=payload, headers=headers)
    print(f"📡 Supabase Response: {response.status_code} - {response.text}")

    check_and_send_alert(temperature, soil_moisture, light_level)

def check_and_send_alert(temperature, soil_moisture, light_level):
    """ Vérifie l'état critique et envoie un SMS si nécessaire """
    global critical_state

    is_critical = (
        soil_moisture < MOISTURE_CRITICAL or 
        temperature < TEMP_CRITICAL or 
        light_level < LIGHT_CRITICAL
    )

    if is_critical and not critical_state:
        send_sms_alert(temperature, soil_moisture, light_level)
        critical_state = True

    elif not is_critical and critical_state:
        send_sms_ok(temperature, soil_moisture, light_level)
        critical_state = False

def send_sms_alert(temperature, soil_moisture, light_level):
    """ Envoie une alerte par SMS en cas de conditions critiques """
    message = (
        "🚨 *Alerte Plante* 🚨\n\n"
        "📉 Niveau critique détecté :\n"
        f"🌡️ Température : {temperature}°C\n"
        f"💧 Humidité : {soil_moisture}%\n"
        f"🔆 Lumière : {light_level}lx\n\n"
        "Cela fait un certain temps que vous n'avez pas vérifié votre plante... 🌱\n"
        "Pensez à l'arroser et à lui donner un peu d'attention ! 💚"
    )

    response = requests.post('https://textbelt.com/text', {
        'phone': PHONE_NUMBER,
        'message': message,
        'key': SMS_API_KEY,
    })

    print(f"📩 SMS envoyé (Alerte): {response.json()}")

def send_sms_ok(temperature, soil_moisture, light_level):
    """ Envoie un SMS rassurant lorsque la situation redevient normale """
    message = (
        "✅ *Votre plante va mieux !* 🌿\n\n"
        "📊 Nouvelles mesures :\n"
        f"🌡️ Température : {temperature}°C\n"
        f"💧 Humidité : {soil_moisture}%\n"
        f"🔆 Lumière : {light_level}lx\n\n"
        "Merci de prendre soin de votre plante ! 🌱💚"
    )

    response = requests.post('https://textbelt.com/text', {
        'phone': PHONE_NUMBER,
        'message': message,
        'key': SMS_API_KEY,
    })

    print(f"📩 SMS envoyé (OK): {response.json()}")

def main():
    """ Lit les données série et les envoie à Supabase """
    try:
        with serial.Serial("/dev/ttyUSB0", 115200, timeout=1) as ser:
            print("🌿 Lecture des données série...")

            while True:
                try:
                    line = ser.readline().decode(errors='ignore').strip()
                    
                    if not line:
                        continue 

                    if not line.startswith("{"):  
                        print(line)
                        continue

                    data = json.loads(line)

                    if data.get("type") == "sendData":
                        print(f"✅ Données reçues: {data}")

                        send_to_supabase(
                            data.get("temperature"),
                            data.get("soilMoisture"),
                            data.get("lightLevel")
                        )

                except json.JSONDecodeError:
                    print("❌ Données corrompues, impossible de parser JSON")

    except serial.SerialException as e:
        print(f"❌ Erreur série : {e}")

if __name__ == "__main__":
    main()
