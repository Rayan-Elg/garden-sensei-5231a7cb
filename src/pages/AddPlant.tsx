import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Plant } from "@/lib/api/plants";
import { createPlant } from "@/lib/api/plants";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPlant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Plant, 'id'>>({
    name: '',
    species: '',
    moisture: 50,
    light: 50,
    last_watered: new Date().toISOString(),  // Changed from lastWatered to last_watered
    image: '',
    description: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
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
        title: "Plante ajoutée avec succès",
        description: "Votre nouvelle plante a été ajoutée à votre jardin.",
      });
      navigate("/");
    } catch (error: any) {  // Add error type
      console.error('Error adding plant:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'ajout de la plante.",
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
          Retour
        </Button>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold mb-6">Ajouter une plante</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la plante</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="species">Espèce</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="image">Photo de la plante</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                {imagePreview ? (
                  <div className="relative w-full aspect-video">
                    <img 
                      src={imagePreview} 
                      alt="Aperçu" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="absolute bottom-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Changer
                    </Button>
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
                      <span>Cliquez ou déposez une image ici</span>
                    </div>
                  </label>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                'Ajouter la plante'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddPlant;
