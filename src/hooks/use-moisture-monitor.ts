
import { useState, useEffect } from "react";
import { Plant } from "@/lib/api/plants";
import { sendSMS } from "@/services/smsService";
import { useToast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/stores/useNotificationStore";

export const useMoistureMonitor = (plant: Plant | null) => {
  const { toast } = useToast();
  const [lastNotificationSent, setLastNotificationSent] = useState<Date | null>(null);
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

    const currentTime = new Date();
    const notificationCooldown = 3600000; // 1 hour in milliseconds

    if (plant.moisture < requiredHumidity && 
        (!lastNotificationSent || (currentTime.getTime() - lastNotificationSent.getTime() > notificationCooldown))) {
      
      // Add to notification panel
      addNotification({
        message: `${plant.name} needs watering! Current moisture level (${plant.moisture}%) is below the recommended level of ${requiredHumidity}%.`,
        plantId: plant.id,
        plantName: plant.name,
      });
      
      try {
        const phoneNumber = localStorage.getItem(`plant-${plant.id}-phone`);
        if (!phoneNumber) return;

        const response = await sendSMS(
          phoneNumber,
          `Your plant ${plant.name} needs watering! Current moisture level (${plant.moisture}%) is below the recommended level of ${requiredHumidity}%.`
        );

        if (response.success) {
          setLastNotificationSent(currentTime);
          toast({
            title: "Notification Sent",
            description: `SMS notification sent. Remaining quota: ${response.quotaRemaining}`,
          });
        }
      } catch (error) {
        console.error('Error sending moisture alert:', error);
      }
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
