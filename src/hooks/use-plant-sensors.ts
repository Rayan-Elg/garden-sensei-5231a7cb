
import { useToast } from "@/hooks/use-toast";
import { updatePlantSensorData, type PlantSensorData } from "@/lib/api/plants";
import { useState } from "react";

export const usePlantSensors = (plantId: string) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateSensorData = async (sensorData: PlantSensorData) => {
    if (!plantId) return null;

    setIsUpdating(true);
    try {
      const updatedPlant = await updatePlantSensorData(plantId, sensorData);
      
      toast({
        title: "Success",
        description: "Plant sensor data has been updated.",
      });

      return updatedPlant;
    } catch (error) {
      console.error('Error updating sensor data:', error);
      toast({
        title: "Error",
        description: "Failed to update plant sensor data.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateSensorData,
    isUpdating
  };
};
