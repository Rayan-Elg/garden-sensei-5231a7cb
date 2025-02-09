import { subHours, subMinutes } from "date-fns";

export interface Sensor {
  id: string;
  name: string;
  type: string;
  battery: number;
  signal: number;
  lastUpdate: string;
  isOnline: boolean;
}

const DEMO_SENSORS: Sensor[] = [
  {
    id: '1',
    name: 'Balcony Sensor',
    type: 'Moisture & Light',
    battery: 85,
    signal: 92,
    lastUpdate: new Date().toISOString(),
    isOnline: true
  },
  {
    id: '2',
    name: 'Indoor Garden',
    type: 'Temperature & Humidity',
    battery: 45,
    signal: 78,
    lastUpdate: subMinutes(new Date(), 15).toISOString(),
    isOnline: true
  },
  {
    id: '3',
    name: 'Window Plants',
    type: 'Light & Temperature',
    battery: 15,
    signal: 65,
    lastUpdate: subHours(new Date(), 2).toISOString(),
    isOnline: false
  },
  {
    id: '4',
    name: 'Herb Garden',
    type: 'Moisture & Temperature',
    battery: 92,
    signal: 25,
    lastUpdate: subMinutes(new Date(), 5).toISOString(),
    isOnline: true
  }
];

export const getSensors = async (): Promise<Sensor[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return DEMO_SENSORS;
};

export const subscribeSensorUpdates = (callback: (data: Sensor) => void) => {
  // TODO: Implement real-time subscription when hardware is ready
  console.log('Sensor updates subscription will be implemented with hardware');
};
