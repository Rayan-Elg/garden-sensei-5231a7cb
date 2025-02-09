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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import type { Plant } from "@/lib/api/plants";
import { deletePlant, getPlantById, updatePlantImage } from "@/lib/api/plants";
import { ArrowLeft, Bell, Droplet, PencilIcon, PhoneCall, Sprout, Sun, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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

  const handlePhoneNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // The actual SMS sending logic will be implemented by the user
    setIsDialogOpen(false);
    toast({
      title: "Phone number submitted",
      description: "You'll receive SMS notifications for this plant.",
    });
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
            Retour
          </Button>

          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <Bell className="w-4 h-4" />
                  Activer les notifications SMS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handlePhoneNumberSubmit}>
                  <DialogHeader>
                    <DialogTitle>Configurer les notifications SMS</DialogTitle>
                    <DialogDescription>
                      Entrez votre numéro de téléphone pour recevoir des notifications concernant {plant.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6">
                    <Input
                      type="tel"
                      placeholder="Entrez votre numéro de téléphone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Activer les notifications</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

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
          <div className="aspect-[16/9] relative group">
            <img 
              src={plant.image || '/placeholder.svg'} 
              alt={plant.name}
              className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleImageClick}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2">{plant.name}</h1>
              <p className="text-gray-500 italic">{plant.species}</p>
            </div>
            
            <p className="text-gray-700">{plant.description}</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    <span>Humidité</span>
                  </div>
                  <span>{plant.moisture}%</span>
                </div>
                <Progress value={plant.moisture} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span>Lumière</span>
                  </div>
                  <span>{plant.light}%</span>
                </div>
                <Progress value={plant.light} className="h-2" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sprout className="w-4 h-4" />
              <span>Dernier arrosage: {new Date(plant.last_watered).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDetail;
