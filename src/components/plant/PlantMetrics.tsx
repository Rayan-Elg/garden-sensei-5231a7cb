
import { Progress } from "@/components/ui/progress";
import { Droplet, Sun, Thermometer } from "lucide-react";

interface PlantMetricsProps {
  moisture: number;
  light: number;
  temperature?: number;
}

const PlantMetrics = ({ moisture, light, temperature = 22 }: PlantMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-lg">
      {/* Moisture Card */}
      <div className="bg-white/80 p-6 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <Droplet className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Moisture</h3>
              <p className="text-sm text-gray-500">Soil humidity</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600 transition-all duration-500">
            {moisture}%
          </span>
        </div>
        <Progress value={moisture} className="h-2 transition-all duration-500" />
      </div>

      {/* Light Card */}
      <div className="bg-white/80 p-6 rounded-lg shadow-sm border border-yellow-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-50 rounded-full">
              <Sun className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Light</h3>
              <p className="text-sm text-gray-500">Light exposure</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-yellow-600 transition-all duration-500">
            {light}%
          </span>
        </div>
        <Progress value={light} className="h-2 transition-all duration-500" />
      </div>

      {/* Temperature Card */}
      <div className="bg-white/80 p-6 rounded-lg shadow-sm border border-red-100 hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-full">
              <Thermometer className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Temperature</h3>
              <p className="text-sm text-gray-500">Ambient temp</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-red-600 transition-all duration-500">
            {temperature}°C
          </span>
        </div>
        <Progress 
          value={((temperature - 10) / 30) * 100} 
          className="h-2 transition-all duration-500" 
        />
      </div>
    </div>
  );
};

export default PlantMetrics;

