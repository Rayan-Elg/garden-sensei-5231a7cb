
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Leaf, Loader2 } from "lucide-react";
import type { Plant } from "@/lib/api/plants";

interface PlantFormProps {
  formData: Omit<Plant, 'id'>;
  imagePreview: string | null;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PlantForm = ({ formData, imagePreview, loading, onInputChange, onSubmit }: PlantFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="species">Species</Label>
        <Input 
          id="species"
          name="species"
          value={formData.species}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
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
  );
};

export default PlantForm;
