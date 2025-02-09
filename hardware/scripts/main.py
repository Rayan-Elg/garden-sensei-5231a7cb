import os
import serial
import json
import requests
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

# Configuration Supabase
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
PLANT_ID = "63163886-8775-4190-9a9c-3cb893ed30c2"

if not SUPABASE_URL or not SUPABASE_API_KEY:
    print("❌ Erreur : Variables d'environnement manquantes. Vérifiez le fichier .env.")
    exit(1)

SUPABASE_PATCH_URL = f"{SUPABASE_URL}/rest/v1/your_table_name?id=eq.{PLANT_ID}"

# Configuration Textbelt (envoi de SMS)
SMS_API_KEY = "39bbdf476046aa16d8749550512216f1e2b393090aXdzG5eyrvQO3dTIT1YLH31l"
PHONE_NUMBER = "5145898299"

# Seuils critiques
TEMP_CRITICAL = 3.0
MOISTURE_CRITICAL = 15.0
LIGHT_CRITICAL = 5.0

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

    response = requests.patch(SUPABASE_PATCH_URL, json=payload, headers=headers)
    print(f"📡 Supabase Response: {response.status_code} - {response.text}")

    send_sms_alert(temperature, soil_moisture, light_level)

def send_sms_alert(temperature, soil_moisture, light_level):
    """ Envoie une alerte par SMS en cas de conditions critiques """
    message = f"🌡️ Alerte Plante !\nTemp: {temperature}°C\nHumidité: {soil_moisture}%\nLumière: {light_level}lx\n🚨 Vérifiez votre plante !"

    response = requests.post('https://textbelt.com/text', {
        'phone': PHONE_NUMBER,
        'message': message,
        'key': SMS_API_KEY,
    })

    print(f"📩 SMS envoyé: {response.json()}")

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
                            data.get("temperature", 0),
                            data.get("soilMoisture", 0),
                            data.get("lightLevel", 0)
                        )

                except json.JSONDecodeError:
                    print("❌ Données corrompues, impossible de parser JSON")

    except serial.SerialException as e:
        print(f"❌ Erreur série : {e}")

if __name__ == "__main__":
    main()
