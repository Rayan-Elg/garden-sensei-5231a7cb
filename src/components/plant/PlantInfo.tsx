
import { Sprout } from "lucide-react";

interface PlantInfoProps {
  name: string;
  species: string;
  description: string;
  lastWatered: string;
}

const PlantInfo = ({ name, species, description, lastWatered }: PlantInfoProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">{name}</h1>
        <p className="text-gray-500 italic">{species}</p>
      </div>
      
      <p className="text-gray-700">{description}</p>
      
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Sprout className="w-4 h-4" />
        <span>Dernier arrosage: {new Date(lastWatered).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default PlantInfo;
