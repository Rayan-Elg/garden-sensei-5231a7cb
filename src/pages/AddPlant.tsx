import Navigation from "@/components/Navigation";
import PlantForm from "@/components/plant/PlantForm";
import PlantImageUpload from "@/components/plant/PlantImageUpload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Plant } from "@/lib/api/plants";
import { createPlant } from "@/lib/api/plants";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPlant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Plant, 'id' | 'user_id'>>({
    name: '',
    species: '',
    moisture: 50,
    light: 50,
    last_watered: new Date().toISOString(),
    image: '',
    description: ''
  });

  const handleImageChange = (imageFile: File, imagePreview: string) => {
    setImagePreview(imagePreview);
    setFormData(prev => ({ ...prev, image: imagePreview }));
  };

  const handleIdentifySuccess = (result: { name: string; species: string; description: string }) => {
    setFormData(prev => ({
      ...prev,
      name: result.name,
      species: result.species,
      description: result.description
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Check auth status first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to add a plant');
      }

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Plant name is required');
      }

      await createPlant(formData);
      toast({
        title: "Plant Added Successfully",
        description: "Your new plant has been added to your garden.",
      });
      navigate("/");
    } catch (error: any) {
      console.error('Error adding plant:', error);
      toast({
        title: "Error Adding Plant",
        description: error?.message || error?.error_description || "An unexpected error occurred. Please try again.",
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
          
          <div className="space-y-6">
            <PlantImageUpload 
              onImageChange={handleImageChange}
              onIdentifySuccess={handleIdentifySuccess}
            />
            
            <PlantForm 
              formData={formData}
              imagePreview={imagePreview}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AddPlant;
