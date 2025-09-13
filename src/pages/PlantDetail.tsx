
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import type { Plant } from "@/lib/api/plants";
import { getPlantById } from "@/lib/api/plants";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMoistureMonitor } from "@/hooks/use-moisture-monitor";
import PlantHeader from "@/components/plant/PlantHeader";
import PlantDetailContainer from "@/components/plant/PlantDetailContainer";
import { useUpdatePlant } from "@/hooks/use-update-plant";

const PlantDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);
  const { checkMoistureLevel } = useMoistureMonitor(plant);
  const { handleImageChange, handleDelete, updateCareInfo, isUpdatingCare } = useUpdatePlant(id);

  useEffect(() => {
    if (id) {
      getPlantById(id)
        .then(data => {
          setPlant(data);
          setLoading(false);
          if (data) {
            checkMoistureLevel(data);
          }
        })
        .catch(error => {
          console.error('Error fetching plant:', error);
          toast({
            title: "Error",
            description: "Unable to load plant details.",
            variant: "destructive"
          });
          setLoading(false);
        });
    }
  }, [id, toast, checkMoistureLevel]);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (plant) {
      const newImageUrl = await handleImageChange(event, plant.image);
      setPlant(prev => prev ? { ...prev, image: newImageUrl } : null);
    }
  };

  const onUpdateCare = async () => {
    if (plant) {
      const updatedPlant = await updateCareInfo(plant.image);
      if (updatedPlant) {
        setPlant(updatedPlant);
      }
    }
  };

  const hasCareGuide = plant && (
    plant.care_water ||
    plant.care_humidity ||
    plant.care_light ||
    plant.care_soil ||
    plant.care_temperature ||
    plant.care_fertilizer ||
    plant.care_warnings
  );

  const needsCareUpdate = plant && !hasCareGuide;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
          Loading...
        </main>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
          Plant not found
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <PlantHeader onDelete={handleDelete} />
        
        <PlantDetailContainer
          plant={plant}
          onImageChange={onImageChange}
          isUpdatingCare={isUpdatingCare}
          isCareGuideOpen={isCareGuideOpen}
          setIsCareGuideOpen={setIsCareGuideOpen}
          onUpdateCare={onUpdateCare}
          needsCareUpdate={needsCareUpdate}
        />
      </main>
    </div>
  );
};

export default PlantDetail;
