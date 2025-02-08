
import { supabase } from '@/lib/supabase';

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
  const { data, error } = await supabase
    .from('sensors')
    .select('*');
  
  if (error) throw error;
  return data;
};

// This will be implemented when hardware integration is ready
export const subscribeSensorUpdates = (callback: (data: Sensor) => void) => {
  // TODO: Implement real-time subscription when hardware is ready
  console.log('Sensor updates subscription will be implemented with hardware');
};
