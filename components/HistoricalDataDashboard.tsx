import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { HistoryIcon } from './Icons';

type TimeFrame = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});

    return (
      <div className="bg-white/70 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="font-semibold text-gray-700">{formattedDate}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value.toFixed(1)} ${pld.unit || ''}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const HistoricalDataDashboard: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('WEEKLY');
  const { getWeeklyData, getMonthlyData, getYearlyData } = useHistoricalData();

  const data = useMemo(() => {
    switch (timeFrame) {
      case 'MONTHLY':
        return getMonthlyData();
      case 'YEARLY':
        return getYearlyData();
      case 'WEEKLY':
      default:
        return getWeeklyData();
    }
  }, [timeFrame, getWeeklyData, getMonthlyData, getYearlyData]);

  const dateFormatter = (dateStr: string) => {
    const date = new Date(dateStr);
     if (timeFrame === 'YEARLY') {
        return date.toLocaleDateString('en-US', { month: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getButtonClass = (mode: TimeFrame) => {
    const baseClass = "px-4 py-2 text-sm font-bold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white/30";
    if (timeFrame === mode) {
      return `${baseClass} bg-emerald-500 text-white shadow-md`;
    }
    return `${baseClass} bg-white/40 hover:bg-white/70 text-slate-700`;
  };

  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div className="flex items-center text-slate-700 mb-4 sm:mb-0">
          <div className="w-8 h-8 mr-3"><HistoryIcon /></div>
          <h2 className="text-2xl font-bold">Historical Data</h2>
        </div>
        <div className="flex space-x-2">
          <button className={getButtonClass('WEEKLY')} onClick={() => setTimeFrame('WEEKLY')}>Weekly</button>
          <button className={getButtonClass('MONTHLY')} onClick={() => setTimeFrame('MONTHLY')}>Monthly</button>
          <button className={getButtonClass('YEARLY')} onClick={() => setTimeFrame('YEARLY')}>Yearly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-600 mb-4 text-center">Water & Soil Levels (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
              <XAxis dataKey="date" tickFormatter={dateFormatter} stroke="#475569" />
              <YAxis stroke="#475569" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="waterLevel" name="Water Level" stroke="#0ea5e9" strokeWidth={2} dot={false} unit="%" />
              <Line type="monotone" dataKey="soilMoisture" name="Soil Moisture" stroke="#84cc16" strokeWidth={2} dot={false} unit="%" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-600 mb-4 text-center">Climate Conditions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
              <XAxis dataKey="date" tickFormatter={dateFormatter} stroke="#475569" />
              <YAxis yAxisId="left" stroke="#ef4444" domain={[0, 40]} />
              <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" domain={[20, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temperature" stroke="#ef4444" strokeWidth={2} dot={false} unit="°C" />
              <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity" stroke="#3b82f6" strokeWidth={2} dot={false} unit="%" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-600 mb-4 text-center">System Voltage (V)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
                <XAxis dataKey="date" tickFormatter={dateFormatter} stroke="#475569" />
                <YAxis stroke="#475569" domain={[11.5, 13.5]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="voltage" name="Voltage" stroke="#f97316" strokeWidth={2} dot={false} unit="V" />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataDashboard;