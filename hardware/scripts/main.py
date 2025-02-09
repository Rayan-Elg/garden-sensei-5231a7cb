import os
import serial
import json
import requests
import time
from dotenv import load_dotenv

load_dotenv()

SERIAL_PORT = os.getenv("SERIAL_PORT", "/dev/ttyUSB0")
BAUD_RATE = int(os.getenv("BAUD_RATE", 115200))
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
PLANT_ID = "0937501c-6bf6-4bcb-a21d-fe39771ac3ce"

HEADERS = {
    "Content-Type": "application/json",
    "apikey": SUPABASE_API_KEY,
    "Authorization": f"Bearer {SUPABASE_API_KEY}"
}

def send_to_supabase(temperature, soil_moisture, light_level):
    """ Envoie les données formatées à Supabase """
    if not SUPABASE_URL or not SUPABASE_API_KEY:
        print("❌ Erreur: Les variables d'environnement Supabase sont manquantes !")
        return
    
    payload = {
        "id": PLANT_ID,
        "sensor_data": {
            "moisture": max(0, min(soil_moisture, 100)),
            "light": max(0, min(light_level, 100)),
            "temperature": max(-50, min(temperature, 100))
        }
    }

    try:
        response = requests.post(SUPABASE_URL, json=payload, headers=HEADERS, timeout=5)
        if response.status_code == 200:
            print(f"✅ Données envoyées avec succès : {payload}")
        else:
            print(f"⚠️ Erreur Supabase: {response.status_code} - {response.text}")

    except requests.RequestException as e:
        print(f"❌ Erreur de connexion à Supabase: {e}")

def main():
    """ Lit les données série et les envoie à Supabase """
    try:
        with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=2) as ser:
            print("🌿 Lecture des données série...")

            while True:
                try:
                    line = ser.readline().decode(errors='ignore').strip()

                    if not line:
                        continue
                    if not line.startswith("{"):
                        print(f"📝 {line}")
                        continue

                    data = json.loads(line)

                    if data.get("type") == "sendData":
                        temperature = data.get("temperature", 0)
                        soil_moisture = data.get("soilMoisture", 0)
                        light_level = data.get("lightLevel", 0)

                        print(f"📡 Données reçues: Temp={temperature}°C, Humidité={soil_moisture}%, Lumière={light_level}%")
                        
                        send_to_supabase(temperature, soil_moisture, light_level)

                except json.JSONDecodeError:
                    print("❌ Données corrompues, impossible de parser JSON")

                time.sleep(1)

    except serial.SerialException as e:
        print(f"❌ Erreur série : {e}")

if __name__ == "__main__":
    main()
