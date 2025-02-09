
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column - Image and Basic Info */}
      <div className="md:col-span-1">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-[1/1]">
            <PlantDetailImage
              image={plant.image}
              name={plant.name}
              onImageChange={onImageChange}
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{plant.name}</h2>
            <p className="text-sm text-gray-500 italic mb-2">{plant.species}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{plant.description}</p>
          </div>
        </div>
      </div>

      {/* Middle and Right Columns - Metrics and Care Info */}
      <div className="md:col-span-2 space-y-6">
        {/* Last Watered Card */}
        <div className="bg-white/80 p-6 rounded-lg shadow-lg border border-primary-100">
          <h3 className="text-2xl font-bold text-primary-600 mb-2">Last Watered</h3>
          <p className="text-3xl font-bold text-gray-800">
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
        <div className="bg-white/80 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Care Guide</h3>
          
          {needsCareUpdate ? (
            <div className="text-center">
              <button
                onClick={onUpdateCare}
                disabled={isUpdatingCare}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                {isUpdatingCare ? "Generating Care Guide..." : "Get Care Information"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plant.care_water && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Watering</h4>
                  <p className="text-blue-600">{plant.care_water}</p>
                </div>
              )}
              {plant.care_light && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Light</h4>
                  <p className="text-yellow-600">{plant.care_light}</p>
                </div>
              )}
              {plant.care_humidity && (
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h4 className="font-semibold text-teal-800">Humidity</h4>
                  <p className="text-teal-600">{plant.care_humidity}</p>
                </div>
              )}
              {plant.care_temperature && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800">Temperature</h4>
                  <p className="text-red-600">{plant.care_temperature}</p>
                </div>
              )}
              {plant.care_soil && (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-800">Soil</h4>
                  <p className="text-amber-600">{plant.care_soil}</p>
                </div>
              )}
              {plant.care_fertilizer && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Fertilizer</h4>
                  <p className="text-green-600">{plant.care_fertilizer}</p>
                </div>
              )}
              {plant.care_warnings && (
                <div className="p-4 bg-rose-50 rounded-lg col-span-full">
                  <h4 className="font-semibold text-rose-800">Warnings</h4>
                  <p className="text-rose-600">{plant.care_warnings}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDetailContainer;
