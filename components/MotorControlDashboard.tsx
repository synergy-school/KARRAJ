import React from 'react';
import { SensorData } from '../types';
import { PowerIcon, SoilMoistureIcon, WaterDropIcon, BellIcon, ZapIcon, CloudIcon } from './Icons';

interface MotorControlDashboardProps {
  sensorData: SensorData;
  motorOverride: 'AUTO' | 'ON' | 'OFF';
  setMotorOverride: (mode: 'AUTO' | 'ON' | 'OFF') => void;
  buzzerOverride: 'AUTO' | 'ON' | 'OFF';
  setBuzzerOverride: (mode: 'AUTO' | 'ON' | 'OFF') => void;
}

const MotorControlDashboard: React.FC<MotorControlDashboardProps> = ({ 
  sensorData, 
  motorOverride, 
  setMotorOverride,
  buzzerOverride,
  setBuzzerOverride
}) => {

  const getMotorButtonClass = (mode: 'AUTO' | 'ON' | 'OFF') => {
    const baseClass = "w-full py-3 text-sm font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/30";
    if (motorOverride === mode) {
      return `${baseClass} bg-emerald-500 text-white shadow-md`;
    }
    return `${baseClass} bg-white/40 hover:bg-white/70 text-slate-700`;
  };
  
  const getBuzzerButtonClass = (mode: 'AUTO' | 'ON' | 'OFF') => {
    const baseClass = "w-full py-3 text-sm font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/30";
    if (buzzerOverride === mode) {
      return `${baseClass} bg-amber-500 text-white shadow-md`;
    }
    return `${baseClass} bg-white/40 hover:bg-white/70 text-slate-700`;
  };

  const isMotorOn = sensorData.motorStatus === 'ON';
  const isBuzzerOn = sensorData.buzzerStatus === 'ON';
  
  const isCritical = sensorData.waterLevel < 20 || sensorData.voltage < 11.8;

  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div className="flex items-center text-slate-700 mb-4 sm:mb-0">
          <div className="w-8 h-8 mr-3"><PowerIcon /></div>
          <h2 className="text-2xl font-bold">System Controls</h2>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-sm font-semibold">CONTROL MODE</p>
          <p className="text-xl font-bold text-slate-800">{motorOverride === 'AUTO' && buzzerOverride === 'AUTO' ? 'FULLY AUTOMATIC' : 'MANUAL OVERRIDE'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        {/* Motor Control Section */}
        <div className="border border-white/30 rounded-lg p-4">
          <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center"><PowerIcon className="w-5 h-5 mr-2"/>Motor Control</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all duration-500 ${isMotorOn ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'} shadow-xl`}>
                {isMotorOn && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className="relative text-xs uppercase tracking-wider">Status</span>
                <span className="relative text-4xl">{sensorData.motorStatus}</span>
              </div>
              {sensorData.isRaining && !isMotorOn && (
                <p className="mt-2 text-xs text-blue-600 font-semibold bg-blue-100/50 rounded-full px-2 py-1">
                    OFF due to rain
                </p>
              )}
            </div>
            <div className="flex flex-col justify-center space-y-2">
                <div className="bg-black/5 rounded-lg p-2 flex items-center">
                    <SoilMoistureIcon className="w-6 h-6 text-lime-600 mr-3"/>
                    <div>
                    <p className="text-xs text-slate-500">Soil Moisture</p>
                    <p className="text-lg font-bold">{sensorData.soilMoisture.toFixed(1)} <span className="text-sm text-slate-500">%</span></p>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <button className={getMotorButtonClass('ON')} onClick={() => setMotorOverride('ON')}>FORCE ON</button>
                <button className={getMotorButtonClass('OFF')} onClick={() => setMotorOverride('OFF')}>FORCE OFF</button>
                <button className={getMotorButtonClass('AUTO')} onClick={() => setMotorOverride('AUTO')}>AUTO MODE</button>
            </div>
          </div>
        </div>

        {/* Buzzer Control Section */}
        <div className="border border-white/30 rounded-lg p-4">
          <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center"><BellIcon className="w-5 h-5 mr-2"/>Buzzer Control</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center justify-center text-center">
                <div className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all duration-500 ${isBuzzerOn ? 'bg-amber-500 shadow-amber-500/50' : 'bg-slate-500 shadow-slate-500/50'} shadow-xl`}>
                  {isBuzzerOn && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>}
                  <span className="relative text-xs uppercase tracking-wider">Status</span>
                  <span className="relative text-4xl">{sensorData.buzzerStatus}</span>
                </div>
                 {sensorData.buzzerStatus === 'ON' && buzzerOverride === 'AUTO' && (
                  <p className={`mt-2 text-xs font-semibold rounded-full px-2 py-1 ${isCritical ? 'text-red-600 bg-red-100/50' : 'text-blue-600 bg-blue-100/50'}`}>
                      {isCritical ? 'Critical Alert!' : 'Rain Detected'}
                  </p>
                )}
              </div>
              <div className="flex flex-col justify-center space-y-2">
                <div className="bg-black/5 rounded-lg p-2 flex items-center">
                    <WaterDropIcon className="w-6 h-6 text-sky-600 mr-3"/>
                    <div>
                    <p className="text-xs text-slate-500">Water Level</p>
                    <p className="text-lg font-bold">{sensorData.waterLevel.toFixed(1)} <span className="text-sm text-slate-500">%</span></p>
                    </div>
                </div>
                <div className="bg-black/5 rounded-lg p-2 flex items-center">
                    <ZapIcon className="w-6 h-6 text-blue-600 mr-3"/>
                    <div>
                    <p className="text-xs text-slate-500">Voltage</p>
                    <p className="text-lg font-bold">{sensorData.voltage.toFixed(2)} <span className="text-sm text-slate-500">V</span></p>
                    </div>
                </div>
                 <div className="bg-black/5 rounded-lg p-2 flex items-center">
                    <CloudIcon className="w-6 h-6 text-gray-500 mr-3"/>
                    <div>
                        <p className="text-xs text-slate-500">Rain Sensor</p>
                        <p className={`text-lg font-bold ${sensorData.isRaining ? 'text-blue-600' : 'text-slate-700'}`}>{sensorData.isRaining ? 'DETECTED' : 'DRY'}</p>
                    </div>
                </div>
              </div>
              <div className="space-y-2">
                  <button className={getBuzzerButtonClass('ON')} onClick={() => setBuzzerOverride('ON')}>FORCE ON</button>
                  <button className={getBuzzerButtonClass('OFF')} onClick={() => setBuzzerOverride('OFF')}>FORCE OFF</button>
                  <button className={getBuzzerButtonClass('AUTO')} onClick={() => setBuzzerOverride('AUTO')}>AUTO MODE</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorControlDashboard;