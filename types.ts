export interface SensorData {
  waterLevel: number; // percentage
  temperature: number; // Celsius
  humidity: number; // percentage
  isRaining: boolean;
  voltage: number; // Volts
  soilMoisture: number; // percentage
  motorStatus: 'ON' | 'OFF';
  buzzerStatus: 'ON' | 'OFF';
}