
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";

const AddPlant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Plante ajoutée avec succès",
        description: "Votre nouvelle plante a été ajoutée à votre jardin.",
      });
      navigate("/");
    }, 1500);
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
            
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la plante</Label>
              <Input id="name" placeholder="Ex: Basilic" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="species">Espèce</Label>
              <Input id="species" placeholder="Ex: Ocimum basilicum" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Décrivez votre plante..."
                className="min-h-[100px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Ajouter la plante
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddPlant;
