
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Droplet, Sun, Sprout, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import Navigation from "@/components/Navigation";
import { useState, useRef } from "react";

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("/lovable-uploads/4b767a9d-283b-4b0f-91d9-0d13bef5af71.png");
  
  // Mock data - in a real app, fetch this from your backend
  const plant = {
    name: "Basilic",
    species: "Ocimum basilicum",
    moisture: 65,
    light: 80,
    lastWatered: "2024-03-10",
    image: imageUrl,
    description: "Le basilic est une herbe aromatique populaire qui nécessite un sol humide et beaucoup de soleil. Idéal pour la cuisine, il peut être cultivé à l'intérieur ou à l'extérieur."
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        toast({
          title: "Image updated",
          description: "Your plant photo has been successfully updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-[16/9] relative group">
            <img 
              src={plant.image} 
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
              <span>Dernier arrosage: {plant.lastWatered}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlantDetail;
