
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { identifyPlant } from "@/lib/api/plant-identification";
import { Leaf, Loader2, Upload, Wand2 } from "lucide-react";
import { useState } from "react";

interface PlantImageUploadProps {
  onImageChange: (imageFile: File, imagePreview: string) => void;
  onIdentifySuccess: (data: { name: string; species: string; description: string }) => void;
}

const PlantImageUpload = ({ onImageChange, onIdentifySuccess }: PlantImageUploadProps) => {
  const { toast } = useToast();
  const [identifying, setIdentifying] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        onImageChange(file, preview);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentifyPlant = async () => {
    if (!imageFile) return;
    
    setIdentifying(true);
    try {
      const result = await identifyPlant(imageFile);
      if (result) {
        onIdentifySuccess(result);

        const confidencePercent = Math.round(result.confidence * 100);
        const confidenceEmoji = confidencePercent >= 90 ? '🎯' : 
                              confidencePercent >= 70 ? '✨' : 
                              confidencePercent >= 50 ? '🤔' : '❓';

        toast({
          title: `Plant Identified! ${confidenceEmoji}`,
          description: (
            <div className="space-y-2">
              <p>We identified this as <strong>{result.name}</strong> with {confidencePercent}% confidence.</p>
              {confidencePercent < 70 && (
                <p className="text-sm text-muted-foreground">
                  Tip: For better accuracy, try taking a photo of the plant's leaves or flowers in good lighting.
                </p>
              )}
            </div>
          ),
          variant: confidencePercent >= 70 ? "default" : "destructive",
        });
      } else {
        toast({
          title: "Identification Failed",
          description: "We couldn't identify this plant. Try taking a clearer photo of the leaves, flowers, or entire plant in good lighting.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error identifying plant:', error);
      toast({
        title: "Error",
        description: "Failed to identify plant. Please check your internet connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIdentifying(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
        {imagePreview ? (
          <div className="relative w-full">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full aspect-video object-cover rounded-lg"
            />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                  onImageChange(null as any, '');
                }}
              >
                Change
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={identifying || !imageFile}
                onClick={handleIdentifyPlant}
                className="min-w-[140px]"
              >
                {identifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Identifying...
                  </>
                ) : imageFile ? (
                  <>
                    <Leaf className="w-4 h-4 mr-2 text-green-500" />
                    Re-identify
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Identify Plant
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <label className="w-full cursor-pointer">
            <Input 
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Upload className="w-8 h-8" />
              <span>Click or drop an image here</span>
              <p className="text-sm text-muted-foreground text-center max-w-[300px]">
                Upload a clear photo of your plant for AI identification. 
                Best results with photos of leaves, flowers, or the whole plant.
              </p>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default PlantImageUpload;
