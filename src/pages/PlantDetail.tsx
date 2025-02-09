
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import type { Plant } from "@/lib/api/plants";
import { deletePlant, getPlantById, updatePlantImage, updatePlantCareInfo } from "@/lib/api/plants";
import { identifyPlant } from "@/lib/api/plant-identification";
import { ArrowLeft, Bell, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SMSNotificationDialog from "@/components/plant/SMSNotificationDialog";
import PlantDetailImage from "@/components/plant/PlantDetailImage";
import PlantInfo from "@/components/plant/PlantInfo";
import PlantMetrics from "@/components/plant/PlantMetrics";
import PlantCareGuide from "@/components/plant/PlantCareGuide";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMoistureMonitor } from "@/hooks/use-moisture-monitor";

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);
  const [isUpdatingCare, setIsUpdatingCare] = useState(false);

  const { checkMoistureLevel } = useMoistureMonitor(plant);

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

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && id && plant) {
      try {
        const newImageUrl = await updatePlantImage(id, file);
        setPlant({ ...plant, image: newImageUrl });
        toast({
          title: "Image updated",
          description: "Your plant photo has been successfully updated.",
        });
      } catch (error) {
        console.error('Error updating image:', error);
        toast({
          title: "Error",
          description: "Failed to update plant image.",
          variant: "destructive"
        });
      }
    }
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

  const updateCareInfo = async () => {
    if (!plant?.image || !id) return;

    setIsUpdatingCare(true);
    try {
      const response = await fetch(plant.image);
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

      setPlant(updatedPlant);
      toast({
        title: "Success",
        description: "Plant care information has been updated.",
      });
    } catch (error) {
      console.error('Error updating care info:', error);
      toast({
        title: "Error",
        description: "Failed to update plant care information.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingCare(false);
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

  const handlePhoneNumberSetup = (phoneNumber: string) => {
    if (plant) {
      localStorage.setItem(`plant-${plant.id}-phone`, phoneNumber);
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Bell className="w-4 h-4" />
              Get Watering Notifications
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Plant</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this plant? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
          <PlantDetailImage
            image={plant.image}
            name={plant.name}
            onImageChange={handleImageChange}
          />
          
          <div className="p-6 space-y-6">
            <PlantInfo
              name={plant.name}
              species={plant.species}
              description={plant.description}
              lastWatered={plant.last_watered}
            />
            
            <PlantMetrics
              moisture={plant.moisture}
              light={plant.light}
            />

            <PlantCareGuide
              plant={plant}
              isCareGuideOpen={isCareGuideOpen}
              setIsCareGuideOpen={setIsCareGuideOpen}
              isUpdatingCare={isUpdatingCare}
              onUpdateCare={updateCareInfo}
              needsCareUpdate={needsCareUpdate}
            />
          </div>
        </div>

        <SMSNotificationDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          plantName={plant.name}
          onPhoneNumberSubmit={handlePhoneNumberSetup}
        />
      </main>
    </div>
  );
};

export default PlantDetail;
