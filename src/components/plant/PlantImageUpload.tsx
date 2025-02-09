
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { identifyPlant } from "@/lib/api/plant-identification";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";

interface PlantImageUploadProps {
  onImageChange: (imageFile: File, imagePreview: string) => void;
  onIdentifySuccess: (data: { name: string; species: string; description: string; careGuide: any }) => void;
}

const PlantImageUpload = ({ onImageChange, onIdentifySuccess }: PlantImageUploadProps) => {
  const { toast } = useToast();
  const [identifying, setIdentifying] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleIdentifyPlant = async (file: File) => {
    setIdentifying(true);
    try {
      const result = await identifyPlant(file);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        onImageChange(file, preview);
      };
      reader.readAsDataURL(file);

      // Automatically start identification process
      await handleIdentifyPlant(file);
    }
  };

  if (!imagePreview) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors">
          <label className="w-full cursor-pointer">
            <Input 
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex flex-col items-center gap-4">
              <Camera className="w-12 h-12 text-gray-400" />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Add a Plant Photo</h3>
                <p className="text-sm text-muted-foreground">
                  Take or upload a photo and we'll help identify your plant
                </p>
                <Button variant="secondary" className="mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Photo
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Or just drag and drop an image here
              </p>
            </div>
          </label>
        </div>
        
        <div className="text-center">
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              onImageChange(null as any, '');
              toast({
                title: "Manual Plant Entry",
                description: "You can now add your plant details manually.",
              });
              setShowForm(true);
            }}
          >
            Skip photo and add plant manually
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative w-full">
        {identifying && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-white text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Identifying your plant...</p>
            </div>
          </div>
        )}
        <img 
          src={imagePreview} 
          alt="Preview" 
          className="w-full aspect-video object-cover rounded-lg"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="absolute bottom-2 right-2"
          onClick={() => {
            setImagePreview(null);
            setImageFile(null);
            onImageChange(null as any, '');
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Remove Photo
        </Button>
      </div>
    </div>
  );
};

export default PlantImageUpload;
