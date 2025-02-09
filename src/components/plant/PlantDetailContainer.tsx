
import { Plant } from "@/lib/api/plants";
import PlantDetailImage from "./PlantDetailImage";
import PlantInfo from "./PlantInfo";
import PlantMetrics from "./PlantMetrics";
import PlantCareGuide from "./PlantCareGuide";

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
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <PlantDetailImage
        image={plant.image}
        name={plant.name}
        onImageChange={onImageChange}
      />
      
      <div className="p-6 space-y-6">
        <PlantInfo
          name={plant.name}
          species={plant.species}
          description={plant.description}
          lastWatered={plant.last_watered}
        />
        
        <PlantMetrics
          moisture={plant.moisture}
          light={plant.light}
        />

        <PlantCareGuide
          plant={plant}
          isCareGuideOpen={isCareGuideOpen}
          setIsCareGuideOpen={setIsCareGuideOpen}
          isUpdatingCare={isUpdatingCare}
          onUpdateCare={onUpdateCare}
          needsCareUpdate={needsCareUpdate}
        />
      </div>
    </div>
  );
};

export default PlantDetailContainer;
