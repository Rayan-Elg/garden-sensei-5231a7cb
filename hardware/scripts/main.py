import os
import serial
import json
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
PLANT_ID = "63163886-8775-4190-9a9c-3cb893ed30c2"

if not SUPABASE_URL or not SUPABASE_API_KEY:
    print("❌ Erreur : Les variables d'environnement ne sont pas chargées. Vérifiez votre fichier .env.")
    exit(1)

SUPABASE_PATCH_URL = f"{SUPABASE_URL}/rest/v1/your_table_name?id=eq.{PLANT_ID}"

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
