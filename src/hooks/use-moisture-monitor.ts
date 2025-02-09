
import { useState, useEffect } from "react";
import { Plant } from "@/lib/api/plants";
import { sendSMS } from "@/services/smsService";
import { useToast } from "@/hooks/use-toast";

export const useMoistureMonitor = (plant: Plant | null) => {
  const { toast } = useToast();
  const [lastNotificationSent, setLastNotificationSent] = useState<Date | null>(null);

  const checkMoistureLevel = async (plant: Plant) => {
    const humidityText = plant.care_humidity || '';
    const humidityMatch = humidityText.match(/(\d+)%/);
    const requiredHumidity = humidityMatch ? parseInt(humidityMatch[1]) : null;

    if (!requiredHumidity) return;

    const currentTime = new Date();
    const notificationCooldown = 3600000; // 1 hour in milliseconds

    if (plant.moisture < requiredHumidity && 
        (!lastNotificationSent || (currentTime.getTime() - lastNotificationSent.getTime() > notificationCooldown))) {
      
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
  };

  useEffect(() => {
    if (plant) {
      checkMoistureLevel(plant);
    }
  }, [plant?.moisture]);

  return { checkMoistureLevel };
};
