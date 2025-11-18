import React from 'react';

interface SensorCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SensorCard: React.FC<SensorCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-lg hover:border-emerald-500/50 transition-all duration-300 min-h-[20rem] flex flex-col">
      <div className="flex items-center text-slate-700 mb-4">
        <div className="w-6 h-6 mr-3">{icon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default SensorCard;