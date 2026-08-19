import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '06:00', actual: 1.2, predicted: 1.1 },
  { time: '08:00', actual: 1.8, predicted: 1.7 },
  { time: '10:00', actual: 2.1, predicted: 2.2 },
  { time: '12:00', actual: 2.5, predicted: 2.5 },
  { time: '14:00', actual: 2.3, predicted: 2.4 },
  { time: '16:00', actual: 2.7, predicted: 2.6 },
  { time: '18:00', actual: 3.1, predicted: 3.0 },
];

export default function ChartsWidget() {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7B00" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FF7B00" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" stroke="#94A3B8" />
          <YAxis stroke="#94A3B8" label={{ value: 'Millions', angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '0.5rem', color: '#fff' }} />
          <Area type="monotone" dataKey="actual" stroke="#FF7B00" fillOpacity={1} fill="url(#colorActual)" name="Actual Visitors (M)" />
          <Area type="monotone" dataKey="predicted" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted Visitors (M)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
