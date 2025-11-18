import { useState, useEffect } from 'react';
import { SensorData } from '../types';

const INITIAL_STATE: SensorData = {
  waterLevel: 75.3,
  temperature: 24.5,
  humidity: 62.1,
  isRaining: false,
  voltage: 12.7,
  soilMoisture: 45.0,
  motorStatus: 'OFF',
  buzzerStatus: 'OFF',
};

const MOISTURE_LOW_THRESHOLD = 30;
const MOISTURE_HIGH_THRESHOLD = 70;
const WATER_CRITICAL_THRESHOLD = 20;
const VOLTAGE_CRITICAL_THRESHOLD = 11.8;


export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData>(INITIAL_STATE);
  const [motorOverride, setMotorOverride] = useState<'AUTO' | 'ON' | 'OFF'>('AUTO');
  const [buzzerOverride, setBuzzerOverride] = useState<'AUTO' | 'ON' | 'OFF'>('AUTO');

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prevData) => {
        // Simulate water level changes (e.g., usage)
        const newWaterLevel = prevData.waterLevel - Math.random() * 0.2;
        
        // Simulate temperature and humidity fluctuations
        const newTemperature = prevData.temperature + (Math.random() - 0.5) * 0.5;
        const newHumidity = prevData.humidity + (Math.random() - 0.5) * 1;

        // Simulate voltage drop/charge
        const newVoltage = prevData.voltage + (Math.random() - 0.49) * 0.05;

        // Simulate rain events
        const isRaining = Math.random() < 0.05 ? !prevData.isRaining : prevData.isRaining;
        const justStartedRaining = isRaining && !prevData.isRaining;

        // --- Motor Control Logic ---
        let newMotorStatus = prevData.motorStatus;
        if (isRaining) {
          newMotorStatus = 'OFF';
        } else {
          if (motorOverride === 'ON') {
            newMotorStatus = 'ON';
          } else if (motorOverride === 'OFF') {
            newMotorStatus = 'OFF';
          } else { // AUTO mode
            if (prevData.soilMoisture < MOISTURE_LOW_THRESHOLD) {
              newMotorStatus = 'ON';
            } else if (prevData.soilMoisture > MOISTURE_HIGH_THRESHOLD) {
              newMotorStatus = 'OFF';
            }
          }
        }
        
        let newSoilMoisture;
        if (newMotorStatus === 'ON') {
            newSoilMoisture = prevData.soilMoisture + Math.random() * 2.0;
        } else {
            newSoilMoisture = prevData.soilMoisture - Math.random() * 0.3;
        }

        if (isRaining) {
            newSoilMoisture += Math.random() * 0.5;
        }

        // --- Buzzer Control Logic ---
        let newBuzzerStatus = prevData.buzzerStatus;
        const isCritical = newWaterLevel < WATER_CRITICAL_THRESHOLD || newVoltage < VOLTAGE_CRITICAL_THRESHOLD;

        if (buzzerOverride === 'ON') {
          newBuzzerStatus = 'ON';
        } else if (buzzerOverride === 'OFF') {
          newBuzzerStatus = 'OFF';
        } else { // AUTO mode
          if (isCritical || justStartedRaining) {
            newBuzzerStatus = 'ON';
          } else {
            newBuzzerStatus = 'OFF';
          }
        }

        return {
          waterLevel: Math.max(0, Math.min(100, newWaterLevel)),
          temperature: Math.max(10, Math.min(40, newTemperature)),
          humidity: Math.max(30, Math.min(90, newHumidity)),
          isRaining,
          voltage: Math.max(11.5, Math.min(13.5, newVoltage)),
          soilMoisture: Math.max(0, Math.min(100, newSoilMoisture)),
          motorStatus: newMotorStatus,
          buzzerStatus: newBuzzerStatus,
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [motorOverride, buzzerOverride]);

  return { sensorData, motorOverride, setMotorOverride, buzzerOverride, setBuzzerOverride };
};