
import { Progress } from "@/components/ui/progress";
import { Droplet, Sun, Thermometer } from "lucide-react";

interface PlantMetricsProps {
  moisture: number;
  light: number;
  temperature?: number;
}

const PlantMetrics = ({ moisture, light, temperature }: PlantMetricsProps) => {
  const displayTemperature = temperature ?? 22; // Default to 22°C if no temperature provided

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Moisture Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <Droplet className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Moisture</h3>
            <p className="text-sm text-gray-500">Soil humidity</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Current Level</span>
            <span className="text-lg font-bold text-blue-600">{moisture}%</span>
          </div>
          <Progress value={moisture} className="h-2" />
        </div>
      </div>

      {/* Light Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 border border-yellow-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-yellow-50 rounded-full">
            <Sun className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Light</h3>
            <p className="text-sm text-gray-500">Light exposure</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Current Level</span>
            <span className="text-lg font-bold text-yellow-600">{light}%</span>
          </div>
          <Progress value={light} className="h-2" />
        </div>
      </div>

      {/* Temperature Card */}
      <div className="bg-white rounded-lg shadow-lg p-4 border border-red-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-red-50 rounded-full">
            <Thermometer className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Temperature</h3>
            <p className="text-sm text-gray-500">Ambient temp</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Current Level</span>
            <span className="text-lg font-bold text-red-600">{displayTemperature}°C</span>
          </div>
          <Progress 
            value={((displayTemperature + 50) / 150) * 100} 
            className="h-2" 
          />
        </div>
      </div>
    </div>
  );
};

export default PlantMetrics;

