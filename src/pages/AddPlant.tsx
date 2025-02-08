
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { identifyPlant } from "@/lib/api/plant-identification";
import type { Plant } from "@/lib/api/plants";
import { createPlant } from "@/lib/api/plants";
import { AlertTriangle, ArrowLeft, Leaf, Loader2, Upload, Wand2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPlant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [identifying, setIdentifying] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Omit<Plant, 'id'>>({
    name: '',
    species: '',
    moisture: 50,
    light: 50,
    last_watered: new Date().toISOString(),
    image: '',
    description: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
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
        setFormData(prev => ({
          ...prev,
          name: result.name,
          species: result.species,
          description: result.description
        }));

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createPlant(formData);
      toast({
        title: "Plant Added Successfully",
        description: "Your new plant has been added to your garden.",
      });
      navigate("/");
    } catch (error: any) {
      console.error('Error adding plant:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while adding the plant.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <Card className="bg-white/80 backdrop-blur-sm p-6">
          <h1 className="text-2xl font-semibold mb-6">Add a Plant</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image">Plant Photo</Label>
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
                          setFormData(prev => ({ ...prev, image: '' }));
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
                        ) : formData.species ? (
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
                      id="image" 
                      name="image"
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

            {!imagePreview && (
              <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <p>Upload a photo to use AI plant identification</p>
              </div>
            )}

            {formData.species && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                <Leaf className="w-4 h-4" />
                <div className="space-y-1">
                  <p className="font-medium">Plant identified!</p>
                  <p className="text-green-700">Species: {formData.species}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Plant Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Input 
                id="species"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Plant...
                </>
              ) : (
                'Add Plant'
              )}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddPlant;
