
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Droplet, Sprout, Sun, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlantCardProps {
  id: string;
  name: string;
  species: string;
  moisture: number;
  light: number;
  temperature?: number;
  last_watered: string;
  image: string;
}

const PlantCard = ({
  id,
  name,
  species,
  moisture,
  light,
  temperature,
  last_watered,
  image,
}: PlantCardProps) => {
  const navigate = useNavigate();
  
  // Add debug logging for temperature
  console.log(`PlantCard ${name} temperature:`, temperature);
  
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in bg-white/80 backdrop-blur-sm group relative"
      onClick={() => navigate(`/plants/${id}`)}
    >
      <div className="aspect-video relative mb-4 overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={name}
          className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
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
            <span className="transition-all duration-500">{moisture}%</span>
          </div>
          <Progress value={moisture} className="h-2 transition-all duration-500" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>Light</span>
            </div>
            <span className="transition-all duration-500">{light}%</span>
          </div>
          <Progress value={light} className="h-2 transition-all duration-500" />
        </div>

        {typeof temperature === 'number' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span>Temperature</span>
              </div>
              <span className="transition-all duration-500">{temperature}°C</span>
            </div>
            <Progress 
              value={((temperature + 50) / 150) * 100} 
              className="h-2 transition-all duration-500" 
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
        <Sprout className="w-4 h-4" />
        <span>Last watered: {formatDistanceToNow(new Date(last_watered), { addSuffix: true })}</span>
      </div>

      {moisture < 30 && (
        <div className="absolute -top-1 -right-1 animate-bounce">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Needs water! 💧
          </span>
        </div>
      )}
    </Card>
  );
};

export default PlantCard;

