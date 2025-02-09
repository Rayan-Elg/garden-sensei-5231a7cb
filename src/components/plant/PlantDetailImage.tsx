
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useRef } from "react";

interface PlantDetailImageProps {
  image: string;
  name: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PlantDetailImage = ({ image, name, onImageChange }: PlantDetailImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="aspect-[16/9] relative group">
      <img 
        src={image || '/placeholder.svg'} 
        alt={name}
        className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
      />
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleImageClick}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );
};

export default PlantDetailImage;
