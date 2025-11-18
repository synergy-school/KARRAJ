
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface GaugeProps {
  value: number;
  color: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, color }) => {
  const data = [{ name: 'value', value: value }];

  return (
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
          barSize={20}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            angleAxisId={0}
            fill={color}
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Gauge;
