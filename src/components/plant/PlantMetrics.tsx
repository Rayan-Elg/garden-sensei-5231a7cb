
import { Progress } from "@/components/ui/progress";
import { Droplet, Sun } from "lucide-react";

interface PlantMetricsProps {
  moisture: number;
  light: number;
}

const PlantMetrics = ({ moisture, light }: PlantMetricsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-blue-500" />
            <span>Humidité</span>
          </div>
          <span className="transition-all duration-500">{moisture}%</span>
        </div>
        <Progress value={moisture} className="h-2 transition-all duration-500" />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span>Lumière</span>
          </div>
          <span className="transition-all duration-500">{light}%</span>
        </div>
        <Progress value={light} className="h-2 transition-all duration-500" />
      </div>
    </div>
  );
};

export default PlantMetrics;

