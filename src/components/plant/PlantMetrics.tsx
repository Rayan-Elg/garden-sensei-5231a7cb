
import { Progress } from "@/components/ui/progress";
import { Droplet, Sun, Thermometer } from "lucide-react";

interface PlantMetricsProps {
  moisture: number;
  light: number;
  temperature?: number; // Optional since we're adding it now
}

const PlantMetrics = ({ moisture, light, temperature = 22 }: PlantMetricsProps) => {
  return (
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

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-500" />
            <span>Temperature</span>
          </div>
          <span className="transition-all duration-500">{temperature}°C</span>
        </div>
        <Progress value={temperature * 2} className="h-2 transition-all duration-500" />
      </div>
    </div>
  );
};

export default PlantMetrics;
