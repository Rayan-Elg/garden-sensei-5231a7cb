
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PlantCard from "@/components/PlantCard";
import SensorCard from "@/components/SensorCard";
import { Button } from "@/components/ui/button";

const mockPlants = [
  {
    name: "Basilic",
    species: "Ocimum basilicum",
    moisture: 65,
    light: 80,
    lastWatered: "2024-03-10",
    image: "/lovable-uploads/4b767a9d-283b-4b0f-91d9-0d13bef5af71.png"
  },
  {
    name: "Tomate",
    species: "Solanum lycopersicum",
    moisture: 45,
    light: 90,
    lastWatered: "2024-03-11",
    image: "/lovable-uploads/89967f8c-bf6e-448b-a8da-753d8d25cb15.png"
  }
];

const mockSensors = [
  {
    name: "Garden Sensor 1",
    type: "Moisture & Light",
    battery: 85,
    signal: 92,
    lastUpdate: "2024-03-12 14:30",
    isOnline: true
  },
  {
    name: "Greenhouse Sensor",
    type: "Temperature & Humidity",
    battery: 65,
    signal: 78,
    lastUpdate: "2024-03-12 14:25",
    isOnline: true
  },
  {
    name: "Garden Sensor 2",
    type: "Soil pH & Moisture",
    battery: 12,
    signal: 45,
    lastUpdate: "2024-03-12 10:15",
    isOnline: false
  }
];

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Plants</h2>
            <Button 
              className="gap-2"
              onClick={() => navigate("/plants/add")}
            >
              <Plus className="w-4 h-4" />
              Add Plant
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPlants.map((plant) => (
              <PlantCard key={plant.name} {...plant} />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Connected Sensors</h2>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Sensor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSensors.map((sensor) => (
              <SensorCard key={sensor.name} {...sensor} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
