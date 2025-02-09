
import { useToast } from "@/hooks/use-toast";
import { updatePlantImage, updatePlantCareInfo, deletePlant } from "@/lib/api/plants";
import { identifyPlant } from "@/lib/api/plant-identification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUpdatePlant = (id: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdatingCare, setIsUpdatingCare] = useState(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, currentImage: string) => {
    const file = event.target.files?.[0];
    if (file && id) {
      try {
        const newImageUrl = await updatePlantImage(id, file);
        toast({
          title: "Image updated",
          description: "Your plant photo has been successfully updated.",
        });
        return newImageUrl;
      } catch (error) {
        console.error('Error updating image:', error);
        toast({
          title: "Error",
          description: "Failed to update plant image.",
          variant: "destructive"
        });
        return currentImage;
      }
    }
    return currentImage;
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deletePlant(id);
      toast({
        title: "Plant deleted",
        description: "Your plant has been successfully removed.",
      });
      navigate("/");
    } catch (error) {
      console.error('Error deleting plant:', error);
      toast({
        title: "Error",
        description: "Failed to delete plant.",
        variant: "destructive"
      });
    }
  };

  const updateCareInfo = async (image: string) => {
    if (!image || !id) return null;

    setIsUpdatingCare(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const imageFile = new File([blob], 'plant-image.jpg', { type: blob.type });
      
      const identification = await identifyPlant(imageFile);
      if (!identification) {
        throw new Error("Could not identify plant");
      }

      const updatedPlant = await updatePlantCareInfo(id, {
        care_water: identification.careGuide.water,
        care_humidity: identification.careGuide.humidity,
        care_light: identification.careGuide.light,
        care_soil: identification.careGuide.soil,
        care_temperature: identification.careGuide.temperature,
        care_fertilizer: identification.careGuide.fertilizer,
        care_warnings: identification.careGuide.warnings,
      });

      toast({
        title: "Success",
        description: "Plant care information has been updated.",
      });

      return updatedPlant;
    } catch (error) {
      console.error('Error updating care info:', error);
      toast({
        title: "Error",
        description: "Failed to update plant care information.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsUpdatingCare(false);
    }
  };

  return {
    handleImageChange,
    handleDelete,
    updateCareInfo,
    isUpdatingCare
  };
};
