import { useMemo } from 'react';

export interface HistoricalDataPoint {
  date: string;
  waterLevel: number;
  temperature: number;
  humidity: number;
  voltage: number;
  soilMoisture: number;
}

const generateHistoricalData = (): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const today = new Date();
  let waterLevel = 70;
  let temperature = 25;
  let humidity = 60;
  let voltage = 12.5;
  let soilMoisture = 50;

  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Simulate seasonal temperature change
    const dayOfYear = (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000);
    const tempSeasonality = Math.sin((dayOfYear / 365 - 0.25) * 2 * Math.PI); // Sin wave for seasons
    temperature = 22 + tempSeasonality * 10 + (Math.random() - 0.5);

    // Simulate other metrics with some noise and correlation
    humidity = 65 - tempSeasonality * 15 + (Math.random() - 0.5) * 5;
    waterLevel += (Math.random() - 0.55) * 2; // Tends to decrease
    soilMoisture = 45 + tempSeasonality * 10 + (Math.random() - 0.5) * 10;
    voltage = 12.5 + (Math.random() - 0.5) * 0.4;

    // Clamp values to realistic ranges
    waterLevel = Math.max(10, Math.min(95, waterLevel));
    temperature = Math.max(5, Math.min(38, temperature));
    humidity = Math.max(30, Math.min(98, humidity));
    voltage = Math.max(11.6, Math.min(13.4, voltage));
    soilMoisture = Math.max(15, Math.min(85, soilMoisture));

    data.push({
      date: date.toISOString().split('T')[0],
      waterLevel: parseFloat(waterLevel.toFixed(1)),
      temperature: parseFloat(temperature.toFixed(1)),
      humidity: parseFloat(humidity.toFixed(1)),
      voltage: parseFloat(voltage.toFixed(2)),
      soilMoisture: parseFloat(soilMoisture.toFixed(1)),
    });
  }
  return data;
};


export const useHistoricalData = () => {
    const historicalData = useMemo(() => generateHistoricalData(), []);
    
    const getWeeklyData = () => historicalData.slice(-7);
    const getMonthlyData = () => historicalData.slice(-30);
    const getYearlyData = () => {
        // Sample data for yearly view to avoid clutter
        return historicalData.filter((_, index) => index % 5 === 0);
    };

    return { getWeeklyData, getMonthlyData, getYearlyData };
}