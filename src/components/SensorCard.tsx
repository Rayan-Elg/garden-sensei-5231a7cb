
import { Battery, Signal, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Card className="p-6 animate-fade-in bg-white/80 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <Badge variant={isOnline ? "default" : "destructive"}>
          {isOnline ? "online" : "offline"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4" />
              <span>Battery</span>
            </div>
            <span>{battery}%</span>
          </div>
          <Progress 
            value={battery} 
            className="h-2"
            color={battery < 20 ? "destructive" : "default"}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Signal className="w-4 h-4" />
              <span>Signal Strength</span>
            </div>
            <span>{signal}%</span>
          </div>
          <Progress value={signal} className="h-2" />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last update: {lastUpdate}</span>
        </div>
      </div>
    </Card>
  );
};

export default SensorCard;
