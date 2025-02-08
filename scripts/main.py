import requests


while True:
    if ser.in_waiting > 0:
        ligne = ser.readline().decode('utf-8').strip()
        if ligne.startswith("Alerte:"):
            alerte = ligne.split(":")[1].strip()
            # Envoyer l'alerte au backend
            data = {'alerte': alerte}
            response = requests.post(url, json=data)
            print(f'Alerte envoyée : {alerte}, Statut : {response.status_code}')
        else:
            # Traitement des données normales
            pass
