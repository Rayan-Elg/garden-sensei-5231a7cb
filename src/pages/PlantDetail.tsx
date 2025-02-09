
import Navigation from "@/components/Navigation";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Plant } from "@/lib/api/plants";
import { deletePlant, getPlantById, updatePlantImage } from "@/lib/api/plants";
import { ArrowLeft, Bell, ChevronDown, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SMSNotificationDialog from "@/components/plant/SMSNotificationDialog";
import PlantDetailImage from "@/components/plant/PlantDetailImage";
import PlantInfo from "@/components/plant/PlantInfo";
import PlantMetrics from "@/components/plant/PlantMetrics";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getPlantById(id)
        .then(data => {
          setPlant(data);
          setLoading(false);
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
  }, [id, toast]);

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

  const hasCareGuide = plant && (
    plant.care_water ||
    plant.care_humidity ||
    plant.care_light ||
    plant.care_soil ||
    plant.care_temperature ||
    plant.care_fertilizer ||
    plant.care_warnings
  );

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

            {hasCareGuide && (
              <Collapsible open={isCareGuideOpen} onOpenChange={setIsCareGuideOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                  >
                    <span>Plant Care Information</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCareGuideOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  {plant.care_water && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Watering Schedule</h3>
                      <p className="text-gray-600">{plant.care_water}</p>
                    </Card>
                  )}
                  
                  {plant.care_humidity && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Humidity Requirements</h3>
                      <p className="text-gray-600">{plant.care_humidity}</p>
                    </Card>
                  )}
                  
                  {plant.care_light && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Light Requirements</h3>
                      <p className="text-gray-600">{plant.care_light}</p>
                    </Card>
                  )}
                  
                  {plant.care_soil && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Soil Type</h3>
                      <p className="text-gray-600">{plant.care_soil}</p>
                    </Card>
                  )}
                  
                  {plant.care_temperature && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Temperature Range</h3>
                      <p className="text-gray-600">{plant.care_temperature}</p>
                    </Card>
                  )}
                  
                  {plant.care_fertilizer && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Fertilization</h3>
                      <p className="text-gray-600">{plant.care_fertilizer}</p>
                    </Card>
                  )}
                  
                  {plant.care_warnings && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Care Warnings</h3>
                      <p className="text-gray-600">{plant.care_warnings}</p>
                    </Card>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>

        <SMSNotificationDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          plantName={plant.name}
        />
      </main>
    </div>
  );
};

export default PlantDetail;

