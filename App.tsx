import React, { useState } from 'react';
import { useSensorData } from './hooks/useSensorData';
import SensorCard from './components/SensorCard';
import Gauge from './components/Gauge';
import MotorControlDashboard from './components/MotorControlDashboard';
import { WaterDropIcon, ThermometerIcon, CloudIcon, ZapIcon, SunIcon, CloudRainIcon, SoilMoistureIcon, PowerIcon, HistoryIcon, DashboardIcon, CameraIcon } from './components/Icons';
import HistoricalDataDashboard from './components/HistoricalDataDashboard';
import CameraView from './components/CameraView';

type View = 'SENSORS' | 'MOTOR' | 'HISTORY' | 'CAMERA';

const App: React.FC = () => {
  const { sensorData, motorOverride, setMotorOverride, buzzerOverride, setBuzzerOverride } = useSensorData();
  const [activeView, setActiveView] = useState<View>('SENSORS');

  const getWaterLevelStatus = (level: number) => {
    if (level < 20) return { text: "Critical Low", color: "text-red-500" };
    if (level < 40) return { text: "Low", color: "text-yellow-500" };
    return { text: "Optimal", color: "text-green-500" };
  };

  const getVoltageStatus = (voltage: number) => {
    if (voltage < 11.8) return { text: "Low Power", color: "text-red-500" };
    if (voltage < 12.2) return { text: "Warning", color: "text-yellow-500" };
    return { text: "Stable", color: "text-green-500" };
  };

  const waterStatus = getWaterLevelStatus(sensorData.waterLevel);
  const voltageStatus = getVoltageStatus(sensorData.voltage);

  const getButtonClass = (view: View) => {
    const baseClass = "flex items-center justify-center w-full sm:w-auto px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/30";
    if (activeView === view) {
      return `${baseClass} bg-emerald-500 text-white shadow-md`;
    }
    return `${baseClass} bg-white/40 hover:bg-white/70 text-slate-700`;
  };

  return (
    <div className="min-h-screen text-slate-800 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">KARRAJ SMART FARMING</h1>
        <p className="text-slate-200 mt-2">Real-time sensor monitoring & historical data analysis</p>
      </header>

      <nav className="mb-8 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-4">
        <button className={getButtonClass('SENSORS')} onClick={() => setActiveView('SENSORS')}>
          <DashboardIcon className="w-5 h-5 mr-2" />
          Sensor Monitoring
        </button>
        <button className={getButtonClass('MOTOR')} onClick={() => setActiveView('MOTOR')}>
          <PowerIcon className="w-5 h-5 mr-2" />
          System Controls
        </button>
        <button className={getButtonClass('HISTORY')} onClick={() => setActiveView('HISTORY')}>
          <HistoryIcon className="w-5 h-5 mr-2" />
          Historical Data
        </button>
        <button className={getButtonClass('CAMERA')} onClick={() => setActiveView('CAMERA')}>
          <CameraIcon className="w-5 h-5 mr-2" />
          Camera View
        </button>
      </nav>
      
      <main>
        {activeView === 'SENSORS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SensorCard title="Water Level" icon={<WaterDropIcon />}>
              <div className="flex flex-col items-center justify-center h-full">
                <Gauge value={sensorData.waterLevel} color="#10b981" />
                <p className="text-4xl font-bold mt-4">{sensorData.waterLevel.toFixed(1)}<span className="text-xl text-slate-500">%</span></p>
                <p className={`mt-2 font-medium ${waterStatus.color}`}>{waterStatus.text}</p>
              </div>
            </SensorCard>

            <SensorCard title="Soil Moisture" icon={<SoilMoistureIcon />}>
              <div className="flex flex-col items-center justify-center h-full">
                  <Gauge value={sensorData.soilMoisture} color="#a3e635" />
                  <p className="text-4xl font-bold mt-4 text-center">{sensorData.soilMoisture.toFixed(1)}<span className="text-xl text-slate-500">%</span></p>
                  <p className="mt-2 font-medium text-slate-600">
                      {sensorData.soilMoisture < 30 ? 'Dry' : sensorData.soilMoisture > 70 ? 'Wet' : 'Optimal'}
                  </p>
                </div>
            </SensorCard>

            <SensorCard title="System Voltage" icon={<ZapIcon />}>
              <div className="flex flex-col items-center justify-center h-full">
                <Gauge value={(sensorData.voltage - 11) * 50} color="#3b82f6" /> 
                <p className="text-4xl font-bold mt-4">{sensorData.voltage.toFixed(2)}<span className="text-xl text-slate-500"> V</span></p>
                <p className={`mt-2 font-medium ${voltageStatus.color}`}>{voltageStatus.text}</p>
              </div>
            </SensorCard>

            <SensorCard title="Climate Conditions" icon={<ThermometerIcon />}>
              <div className="flex flex-col justify-around h-full space-y-6 pt-4">
                  <div className="text-center">
                      <p className="text-slate-500 text-sm">TEMPERATURE</p>
                      <p className="text-4xl font-bold">{sensorData.temperature.toFixed(1)}<span className="text-xl align-top">°C</span></p>
                  </div>
                  <div className="text-center">
                      <p className="text-slate-500 text-sm">HUMIDITY</p>
                      <p className="text-4xl font-bold">{sensorData.humidity.toFixed(1)}<span className="text-xl text-slate-500">%</span></p>
                  </div>
              </div>
            </SensorCard>

            <SensorCard title="Rain Detection" icon={<CloudIcon />}>
              <div className={`flex flex-col items-center justify-center h-full transition-colors duration-500 rounded-lg ${sensorData.isRaining ? 'bg-blue-200/30' : 'bg-yellow-100/30'}`}>
                {sensorData.isRaining ? <CloudRainIcon className="w-24 h-24 text-blue-500" /> : <SunIcon className="w-24 h-24 text-yellow-500" />}
                <p className={`mt-4 text-2xl font-bold ${sensorData.isRaining ? 'text-blue-600' : 'text-yellow-600'}`}>
                  {sensorData.isRaining ? "Rain Detected" : "No Rain"}
                </p>
              </div>
            </SensorCard>
          </div>
        )}

        {activeView === 'MOTOR' && (
          <MotorControlDashboard 
            sensorData={sensorData} 
            motorOverride={motorOverride} 
            setMotorOverride={setMotorOverride}
            buzzerOverride={buzzerOverride}
            setBuzzerOverride={setBuzzerOverride}
          />
        )}
        
        {activeView === 'HISTORY' && (
          <HistoricalDataDashboard />
        )}

        {activeView === 'CAMERA' && (
          <CameraView />
        )}
      </main>
    </div>
  );
};

export default App;