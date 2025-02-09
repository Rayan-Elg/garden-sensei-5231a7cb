
import Navigation from "@/components/Navigation";
import PlantCard from "@/components/PlantCard";
import SensorCard from "@/components/SensorCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getPlants } from "@/lib/api/plants";
import { getSensors } from "@/lib/api/sensors";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const gardeningTips = [
  "Water your plants early in the morning to reduce evaporation 🌅",
  "Check soil moisture before watering to avoid overwatering 💧",
  "Most plants prefer well-draining soil to prevent root rot 🌱",
  "Remove dead leaves to encourage healthy growth ✂️",
  "Position plants according to their light requirements ☀️"
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const randomTip = gardeningTips[Math.floor(Math.random() * gardeningTips.length)];
  
  const { data: plants = [], isLoading: plantsLoading, error: plantsError } = useQuery({
    queryKey: ['plants'],
    queryFn: getPlants,
    retry: false
  });

  const { data: sensors = [], isLoading: sensorsLoading } = useQuery({
    queryKey: ['sensors'],
    queryFn: getSensors
  });

  useEffect(() => {
    if (plantsError) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to Supabase. Please check your configuration.",
        variant: "destructive"
      });
    }
  }, [plantsError, toast]);

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

        <Tabs defaultValue="plants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] border border-border bg-white shadow-sm">
            <TabsTrigger 
              value="plants"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
            >
              Plants
            </TabsTrigger>
            <TabsTrigger 
              value="sensors"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors"
            >
              Sensors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plants" className="space-y-6">
            <div className="flex justify-between items-center">
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
              {plantsLoading ? (
                <Card className="col-span-full p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-4xl animate-bounce">🌿</span>
                    <p className="text-gray-600">Loading your garden...</p>
                  </div>
                </Card>
              ) : plantsError ? (
                <Card className="col-span-full p-8 text-center bg-white/80 backdrop-blur-sm animate-fade-in">
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-4xl">⚠️</span>
                    <h3 className="text-xl font-semibold">Connection Error</h3>
                    <div className="text-gray-600 max-w-md">
                      <p>Unable to connect to Supabase. Please make sure you have:</p>
                      <ol className="list-decimal list-inside mt-2 text-left">
                        <li>Connected your Supabase project in the settings</li>
                        <li>Properly configured your environment variables</li>
                        <li>Created the necessary database tables</li>
                      </ol>
                    </div>
                  </div>
                </Card>
              ) : plants.length === 0 ? (
                <Card className="col-span-full p-8 text-center bg-white/80 backdrop-blur-sm animate-fade-in">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2 text-4xl">
                      <span>🌱</span>
                      <span>🪴</span>
                      <span>🌿</span>
                    </div>
                    <h3 className="text-xl font-semibold">Welcome to Your Digital Garden!</h3>
                    <div className="text-gray-600 max-w-md space-y-4">
                      <p>
                        Ready to start your gardening journey? Add your first plant and:
                      </p>
                      <ul className="text-left space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Track watering schedules
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Monitor light and moisture levels
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          Document your plant's growth
                        </li>
                      </ul>
                    </div>
                    <Button 
                      onClick={() => navigate("/plants/add")}
                      className="mt-2"
                      size="lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Plant
                    </Button>
                  </div>
                </Card>
              ) : (
                plants.map((plant) => (
                  <PlantCard key={plant.id} {...plant} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sensors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Connected Sensors</h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Sensor
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sensorsLoading ? (
                <Card className="col-span-full p-8 text-center">
                  Loading sensors...
                </Card>
              ) : sensors.length === 0 ? (
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
                sensors.map((sensor) => (
                  <SensorCard key={sensor.id} {...sensor} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

