
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ChevronDown, Leaf, Loader2 } from "lucide-react";
import type { Plant } from "@/lib/api/plants";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface PlantFormProps {
  formData: Omit<Plant, 'id'>;
  imagePreview: string | null;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  careGuide?: {
    water: string;
    humidity: string;
    light: string;
    soil: string;
    temperature: string;
    fertilizer: string;
    warnings: string;
  };
}

const PlantForm = ({ formData, imagePreview, loading, onInputChange, onSubmit, careGuide }: PlantFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

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

      {careGuide && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span>Plant Care Information</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="water">Watering Schedule</Label>
              <Textarea 
                id="water"
                name="water"
                defaultValue={careGuide.water}
                className="min-h-[60px]"
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity Requirements</Label>
              <Textarea 
                id="humidity"
                name="humidity"
                defaultValue={careGuide.humidity}
                className="min-h-[60px]"
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="light">Light Requirements</Label>
              <Textarea 
                id="light"
                name="light"
                defaultValue={careGuide.light}
                className="min-h-[60px]"
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="soil">Soil Type</Label>
              <Textarea 
                id="soil"
                name="soil"
                defaultValue={careGuide.soil}
                className="min-h-[60px]"
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature Range</Label>
              <Textarea 
                id="temperature"
                name="temperature"
                defaultValue={careGuide.temperature}
                className="min-h-[60px]"
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fertilizer">Fertilization</Label>
              <Textarea 
                id="fertilizer"
                name="fertilizer"
                defaultValue={careGuide.fertilizer}
                className="min-h-[60px]"
                onChange={onInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="warnings">Care Warnings</Label>
              <Textarea 
                id="warnings"
                name="warnings"
                defaultValue={careGuide.warnings}
                className="min-h-[60px]"
                onChange={onInputChange}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
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

