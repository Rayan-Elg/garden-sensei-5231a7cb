
import { supabase } from '@/lib/supabase';

export interface Plant {
  id: string;
  name: string;
  species: string;
  moisture: number;
  light: number;
  lastWatered: string;
  image: string;
  description: string;
}

export const getPlants = async (): Promise<Plant[]> => {
  const { data, error } = await supabase
    .from('plants')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const getPlantById = async (id: string): Promise<Plant> => {
  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePlantImage = async (plantId: string, imageFile: File): Promise<string> => {
  const fileExt = imageFile.name.split('.').pop();
  const fileName = `${plantId}.${fileExt}`;
  const filePath = `plant-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('plants')
    .upload(filePath, imageFile, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('plants')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('plants')
    .update({ image: publicUrl })
    .eq('id', plantId);

  if (updateError) throw updateError;

  return publicUrl;
};
