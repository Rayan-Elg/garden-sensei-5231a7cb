
import { supabase, checkSupabaseConnection } from '../supabase';

export interface Sensor {
  id: string;
  name: string;
  type: string;
  battery: number;
  signal: number;
  lastUpdate: string;
  isOnline: boolean;
}

export const getSensors = async (): Promise<Sensor[]> => {
  const isConnected = await checkSupabaseConnection();
  if (!isConnected) {
    return [];
  }

  const { data, error } = await supabase
    .from('sensors')
    .select('*');
  
  if (error) throw error;
  return data || [];
};

export const subscribeSensorUpdates = (callback: (data: Sensor) => void) => {
  // TODO: Implement real-time subscription when hardware is ready
  console.log('Sensor updates subscription will be implemented with hardware');
};
