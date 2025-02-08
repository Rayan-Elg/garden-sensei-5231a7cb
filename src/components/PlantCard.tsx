
import { Sprout, Droplet, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PlantCardProps {
  name: string;
  species: string;
  moisture: number;
  light: number;
  lastWatered: string;
  image: string;
}

const PlantCard = ({
  name,
  species,
  moisture,
  light,
  lastWatered,
  image,
}: PlantCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in bg-white/80 backdrop-blur-sm"
      onClick={() => navigate(`/plants/${name.toLowerCase()}`)}
    >
      <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-sm text-gray-500 mb-4">{species}</p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-blue-500" />
              <span>Moisture</span>
            </div>
            <span>{moisture}%</span>
          </div>
          <Progress value={moisture} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>Light</span>
            </div>
            <span>{light}%</span>
          </div>
          <Progress value={light} className="h-2" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
        <Sprout className="w-4 h-4" />
        <span>Last watered: {lastWatered}</span>
      </div>
    </Card>
  );
};

export default PlantCard;
