import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PlantCard from "@/components/PlantCard";
import SensorCard from "@/components/SensorCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mockPlants = [
  {
    name: "Basilic",
    species: "Ocimum basilicum",
    moisture: 65,
    light: 80,
    lastWatered: "2024-03-10",
    image: "/lovable-uploads/4e62e7ad-8b3b-4bb0-ac4d-8455a9118a0e.png"
  },
  {
    name: "Tomate",
    species: "Solanum lycopersicum",
    moisture: 45,
    light: 90,
    lastWatered: "2024-03-11",
    image: "/lovable-uploads/ceda9635-71d0-47d6-8dbf-65403d49beb4.png"
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

const gardeningTips = [
  "Water your plants early in the morning to reduce evaporation 🌅",
  "Check soil moisture before watering to avoid overwatering 💧",
  "Most plants prefer well-draining soil to prevent root rot 🌱",
  "Remove dead leaves to encourage healthy growth ✂️",
  "Position plants according to their light requirements ☀️"
];

const Index = () => {
  const navigate = useNavigate();
  const randomTip = gardeningTips[Math.floor(Math.random() * gardeningTips.length)];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Tip of the day */}
        <Card className="p-4 mb-8 bg-white/80 backdrop-blur-sm border-green-100 animate-fade-in">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Tip of the day:</span> {randomTip}
          </p>
        </Card>

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
            {mockPlants.length === 0 ? (
              <Card className="col-span-full p-8 text-center bg-white/80 backdrop-blur-sm animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-4xl">🌱</span>
                  <h3 className="text-xl font-semibold">Welcome to SmartGarden Manager!</h3>
                  <p className="text-gray-600 max-w-md">
                    Let's get started by adding your first plant using the 'Add Plant' button above. 
                    You can upload a photo and we'll help identify your plant!
                  </p>
                  <Button 
                    onClick={() => navigate("/plants/add")}
                    className="mt-2"
                  >
                    Add Your First Plant
                  </Button>
                </div>
              </Card>
            ) : (
              mockPlants.map((plant) => (
                <PlantCard key={plant.name} {...plant} />
              ))
            )}
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
            {mockSensors.length === 0 ? (
              <Card className="col-span-full p-8 text-center bg-white/80 backdrop-blur-sm animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-4xl">📡</span>
                  <h3 className="text-xl font-semibold">No Sensors Connected</h3>
                  <p className="text-gray-600 max-w-md">
                    Connect your first sensor to start monitoring your garden's conditions in real-time.
                  </p>
                  <Button className="mt-2">
                    Set Up a Sensor
                  </Button>
                </div>
              </Card>
            ) : (
              mockSensors.map((sensor) => (
                <SensorCard key={sensor.name} {...sensor} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
