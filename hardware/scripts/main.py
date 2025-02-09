import serial
import json
import requests

SERIAL_PORT = "/dev/ttyUSB0"
BAUD_RATE = 115200

SUPABASE_URL = "https://your_supabase_url/rest/v1/rpc/update_plant_sensor_data"
SUPABASE_API_KEY = "YOUR_SUPABASE_ANON_KEY"
PLANT_ID = "0937501c-6bf6-4bcb-a21d-fe39771ac3ce"

def send_to_supabase(temperature, soil_moisture, light_level):
    """ Envoie les données formatées à Supabase """
    payload = {
        "id": PLANT_ID,
        "sensor_data": {
            "moisture": max(0, min(soil_moisture, 100)),
            "light": max(0, min(light_level, 100)),
            "temperature": max(-50, min(temperature, 100))
        }
    }

    headers = {
        "Content-Type": "application/json",
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}"
    }

    response = requests.post(SUPABASE_URL, json=payload, headers=headers)
    print(f"📡 Supabase Response: {response.status_code} - {response.text}")

def main():
    """ Lit les données série et les envoie à Supabase """
    try:
        with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1) as ser:
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
