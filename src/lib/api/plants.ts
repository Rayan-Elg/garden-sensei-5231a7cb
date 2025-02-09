import { checkSupabaseConnection, supabase } from '../supabase';

export interface Plant {
  id: string;
  name: string;
  species: string;
  moisture: number;
  light: number;
  temperature: number;
  last_watered: string;
  image: string;
  description: string;
  user_id: string;
  care_water?: string;
  care_humidity?: string;
  care_light?: string;
  care_soil?: string;
  care_temperature?: string;
  care_fertilizer?: string;
  care_warnings?: string;
}

export interface PlantSensorData {
  moisture?: number;
  light?: number;
  temperature?: number;
}

export const getPlants = async (): Promise<Plant[]> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    return [];
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('user_id', user.id);
  
  if (error) throw error;
  
  // Add debug logging for temperature values
  console.log('Plants data from database:', data?.map(plant => ({
    name: plant.name,
    temperature: plant.temperature
  })));
  
  return data || [];
};

export const getPlantById = async (id: string): Promise<Plant | null> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('plants')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePlantImage = async (plantId: string, imageFile: File): Promise<string> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    throw new Error('Unable to connect to Supabase storage');
  }

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

const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type });
};

export const createPlant = async (plant: Omit<Plant, 'id' | 'user_id'>): Promise<Plant> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    throw new Error('Unable to connect to Supabase');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  let imageUrl = null;
  
  // Handle image upload if image is provided as base64
  if (plant.image && plant.image.startsWith('data:image')) {
    try {
      const file = await dataUrlToFile(plant.image, `${Date.now()}.jpg`);
      const filePath = `plant-images/${user.id}/${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('plants')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('plants')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Continue with plant creation even if image upload fails
    }
  }

  const plantWithDefaults = {
    ...plant,
    user_id: user.id,
    moisture: plant.moisture ?? 50,
    light: plant.light ?? 50,
    last_watered: plant.last_watered ?? new Date().toISOString(),
    image: imageUrl || plant.image || null,
    species: plant.species || null,
    description: plant.description || null,
    care_water: plant.care_water || null,
    care_humidity: plant.care_humidity || null,
    care_light: plant.care_light || null,
    care_soil: plant.care_soil || null,
    care_temperature: plant.care_temperature || null,
    care_fertilizer: plant.care_fertilizer || null,
    care_warnings: plant.care_warnings || null
  };

  console.log('Creating plant with data:', plantWithDefaults);

  const { data, error } = await supabase
    .from('plants')
    .insert([plantWithDefaults])
    .select()
    .single();

  if (error) {
    console.error('Error creating plant:', error);
    throw error;
  }
  
  console.log('Plant created successfully:', data);
  return data;
};

export const deletePlant = async (id: string): Promise<void> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    throw new Error('Unable to connect to Supabase');
  }

  // First, try to delete the plant image from storage if it exists
  const { data: plant } = await supabase
    .from('plants')
    .select('image')
    .eq('id', id)
    .single();

  if (plant?.image) {
    try {
      // Extract the file path from the URL
      const url = new URL(plant.image);
      const filePath = url.pathname.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('plants')
          .remove([`plant-images/${filePath}`]);
      }
    } catch (error) {
      console.error('Error deleting plant image:', error);
      // Continue with plant deletion even if image deletion fails
    }
  }

  // Delete the plant record
  const { error } = await supabase
    .from('plants')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updatePlantCareInfo = async (id: string, careInfo: Partial<Plant>): Promise<Plant> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    throw new Error('Unable to connect to Supabase');
  }

  const { data, error } = await supabase
    .from('plants')
    .update(careInfo)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePlantSensorData = async (id: string, sensorData: PlantSensorData): Promise<Plant> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    throw new Error('Unable to connect to Supabase');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Validate the input data
  const updateData: any = {};
  if (typeof sensorData.moisture === 'number' && sensorData.moisture >= 0 && sensorData.moisture <= 100) {
    updateData.moisture = sensorData.moisture;
  }
  if (typeof sensorData.light === 'number' && sensorData.light >= 0 && sensorData.light <= 100) {
    updateData.light = sensorData.light;
  }
  if (typeof sensorData.temperature === 'number' && sensorData.temperature >= -50 && sensorData.temperature <= 100) {
    updateData.temperature = sensorData.temperature;
  }

  console.log('Updating plant sensor data:', { id, updateData });

  const { data, error } = await supabase
    .from('plants')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
