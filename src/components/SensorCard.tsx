import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Battery, Clock, Droplet, Signal, Sun, Thermometer } from "lucide-react";

interface SensorCardProps {
  name: string;
  type: string;
  battery: number;
  signal: number;
  lastUpdate: string;
  isOnline: boolean;
}

const SensorCard = ({
  name,
  type,
  battery,
  signal,
  lastUpdate,
  isOnline,
}: SensorCardProps) => {
  const getSensorIcon = () => {
    if (type.toLowerCase().includes('moisture')) return <Droplet className="w-4 h-4 text-blue-500" />;
    if (type.toLowerCase().includes('temperature')) return <Thermometer className="w-4 h-4 text-red-500" />;
    if (type.toLowerCase().includes('light')) return <Sun className="w-4 h-4 text-yellow-500" />;
    return null;
  };

  return (
    <Card className="p-6 animate-fade-in bg-white/80 backdrop-blur-sm group hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getSensorIcon()}
            <h3 className="text-lg font-semibold">{name}</h3>
          </div>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <Badge variant={isOnline ? "default" : "destructive"} className={isOnline ? "animate-pulse" : ""}>
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Battery className={`w-4 h-4 ${battery < 20 ? 'text-red-500' : battery < 50 ? 'text-yellow-500' : 'text-green-500'}`} />
              <span>Battery</span>
            </div>
            <span className={battery < 20 ? 'text-red-500 font-medium' : ''}>{battery}%</span>
          </div>
          <Progress 
            value={battery} 
            className="h-2"
            color={battery < 20 ? "destructive" : battery < 50 ? "warning" : "default"}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Signal className={`w-4 h-4 ${signal < 30 ? 'text-red-500' : signal < 60 ? 'text-yellow-500' : 'text-green-500'}`} />
              <span>Signal Strength</span>
            </div>
            <span>{signal}%</span>
          </div>
          <Progress 
            value={signal} 
            className="h-2"
            color={signal < 30 ? "destructive" : signal < 60 ? "warning" : "default"}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last update: {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true })}</span>
        </div>
      </div>
    </Card>
  );
};

export default SensorCard;
