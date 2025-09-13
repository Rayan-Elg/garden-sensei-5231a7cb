
import { Plant } from "@/lib/api/plants";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import PlantDetailImage from "./PlantDetailImage";
import PlantMetrics from "./PlantMetrics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PlantDetailContainerProps {
  plant: Plant;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUpdatingCare: boolean;
  isCareGuideOpen: boolean;
  setIsCareGuideOpen: (open: boolean) => void;
  onUpdateCare: () => void;
  needsCareUpdate: boolean;
}

const PlantDetailContainer = ({
  plant,
  onImageChange,
  isUpdatingCare,
  isCareGuideOpen,
  setIsCareGuideOpen,
  onUpdateCare,
  needsCareUpdate,
}: PlantDetailContainerProps) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEnableNotifications = () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }

    // Show confirmation toast
    toast({
      title: "Success",
      description: `Notifications enabled for ${phoneNumber}`
    });
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img 
                src={plant.image} 
                alt={plant.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{plant.name}</h2>
              <p className="text-sm text-gray-500 italic">{plant.species}</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Enable Plant Notifications</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Setup Plant Notifications</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number (e.g., 1234567890)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Enter number without spaces, dashes, or country code
                  </p>
                </div>
                <Button 
                  onClick={handleEnableNotifications} 
                  className="w-full"
                >
                  Enable Notifications
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Last Watered Section */}
      <div className="bg-primary-50 rounded-lg shadow-lg p-6 border border-primary-100">
        <h3 className="text-lg font-semibold text-primary-700 mb-2">Last Watered</h3>
        <p className="text-3xl font-bold text-primary-800">
          {new Date(plant.last_watered).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Plant Metrics */}
      <PlantMetrics
        moisture={plant.moisture}
        light={plant.light}
        temperature={plant.temperature}
      />

      {/* Care Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plant.care_water && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Watering</h4>
            <p className="text-blue-600">{plant.care_water}</p>
          </div>
        )}
        {plant.care_light && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Light</h4>
            <p className="text-yellow-600">{plant.care_light}</p>
          </div>
        )}
        {plant.care_humidity && (
          <div className="p-4 bg-teal-50 rounded-lg">
            <h4 className="font-semibold text-teal-800 mb-2">Humidity</h4>
            <p className="text-teal-600">{plant.care_humidity}</p>
          </div>
        )}
        {plant.care_temperature && (
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Temperature</h4>
            <p className="text-red-600">{plant.care_temperature}</p>
          </div>
        )}
        {plant.care_soil && (
          <div className="p-4 bg-amber-50 rounded-lg">
            <h4 className="font-semibold text-amber-800 mb-2">Soil</h4>
            <p className="text-amber-600">{plant.care_soil}</p>
          </div>
        )}
        {plant.care_fertilizer && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Fertilizer</h4>
            <p className="text-green-600">{plant.care_fertilizer}</p>
          </div>
        )}
        {plant.care_warnings && (
          <div className="p-4 bg-rose-50 rounded-lg col-span-full">
            <h4 className="font-semibold text-rose-800 mb-2">Warnings</h4>
            <p className="text-rose-600">{plant.care_warnings}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDetailContainer;

