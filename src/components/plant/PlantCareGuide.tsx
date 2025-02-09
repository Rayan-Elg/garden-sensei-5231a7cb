
import { Plant } from "@/lib/api/plants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PlantCareGuideProps {
  plant: Plant;
  isCareGuideOpen: boolean;
  setIsCareGuideOpen: (open: boolean) => void;
  isUpdatingCare: boolean;
  onUpdateCare: () => void;
  needsCareUpdate: boolean;
}

const PlantCareGuide = ({
  plant,
  isCareGuideOpen,
  setIsCareGuideOpen,
  isUpdatingCare,
  onUpdateCare,
  needsCareUpdate,
}: PlantCareGuideProps) => {
  return (
    <>
      {needsCareUpdate && (
        <div className="flex justify-center">
          <Button
            onClick={onUpdateCare}
            disabled={isUpdatingCare}
            className="w-full sm:w-auto"
          >
            {isUpdatingCare && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Get Care Information
          </Button>
        </div>
      )}

      <Collapsible open={isCareGuideOpen} onOpenChange={setIsCareGuideOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
          >
            <span>Plant Care Information</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCareGuideOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {plant.care_water && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Watering Schedule</h3>
              <p className="text-gray-600">{plant.care_water}</p>
            </Card>
          )}
          
          {plant.care_humidity && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Humidity Requirements</h3>
              <p className="text-gray-600">{plant.care_humidity}</p>
            </Card>
          )}
          
          {plant.care_light && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Light Requirements</h3>
              <p className="text-gray-600">{plant.care_light}</p>
            </Card>
          )}
          
          {plant.care_soil && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Soil Type</h3>
              <p className="text-gray-600">{plant.care_soil}</p>
            </Card>
          )}
          
          {plant.care_temperature && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Temperature Range</h3>
              <p className="text-gray-600">{plant.care_temperature}</p>
            </Card>
          )}
          
          {plant.care_fertilizer && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Fertilization</h3>
              <p className="text-gray-600">{plant.care_fertilizer}</p>
            </Card>
          )}
          
          {plant.care_warnings && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Care Warnings</h3>
              <p className="text-gray-600">{plant.care_warnings}</p>
            </Card>
          )}
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default PlantCareGuide;
