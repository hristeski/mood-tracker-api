import { useEffect, useState } from 'react';
import api from '../api/axios';

interface HeatmapData {
  date: string;
  count: number;
}

export default function Heatmap() {
  const [data, setData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    api.get('/records/heatmap').then(res => setData(res.data));
  }, []);

  // Генерирање на последните 30 дена
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const getIntensity = (date: string) => {
    const found = data.find(d => new Date(d.date).toISOString().split('T')[0] === date);
    if (!found) return 'bg-slate-100 dark:bg-slate-800';
    if (found.count === 1) return 'bg-violet-300';
    if (found.count === 2) return 'bg-violet-500';
    return 'bg-violet-700'; // Многу активен ден
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="font-bold text-slate-700 dark:text-white mb-4">Твојот 30-дневен интензитет</h3>
      <div className="grid grid-cols-10 gap-2">
        {days.map((day) => (
          <div
            key={day}
            title={day}
            className={`w-full aspect-square rounded-md transition-all ${getIntensity(day)}`}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-4 text-xs text-slate-400">
        <div className="w-3 h-3 bg-slate-100 rounded-sm" /> 0
        <div className="w-3 h-3 bg-violet-300 rounded-sm" /> 1
        <div className="w-3 h-3 bg-violet-500 rounded-sm" /> 2+
      </div>
    </div>
  );
}