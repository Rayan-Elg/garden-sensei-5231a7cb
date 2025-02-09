
import { useState, useEffect } from "react";
import { Plant } from "@/lib/api/plants";
import { useToast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/stores/useNotificationStore";

export const useMoistureMonitor = (plant: Plant | null) => {
  const { toast } = useToast();
  const [lastMoistureLevel, setLastMoistureLevel] = useState<number | null>(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const checkMoistureLevel = async (plant: Plant) => {
    const humidityText = plant.care_humidity || '';
    const humidityMatch = humidityText.match(/(\d+)%/);
    const requiredHumidity = humidityMatch ? parseInt(humidityMatch[1]) : null;

    if (!requiredHumidity) return;

    // Only proceed if this is a real moisture change (not initial load)
    if (lastMoistureLevel !== null && plant.moisture === lastMoistureLevel) {
      return;
    }

    if (plant.moisture < requiredHumidity) {
      // Add to notification panel
      addNotification({
        message: `${plant.name} needs watering! Current moisture level (${plant.moisture}%) is below the recommended level of ${requiredHumidity}%.`,
        plantId: plant.id,
        plantName: plant.name,
      });
    }

    // Update the last known moisture level
    setLastMoistureLevel(plant.moisture);
  };

  useEffect(() => {
    if (plant) {
      checkMoistureLevel(plant);
    }
  }, [plant?.moisture]);

  return { checkMoistureLevel };
};
