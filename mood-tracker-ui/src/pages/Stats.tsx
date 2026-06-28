import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';

interface Record {
  id: number;
  moodScore: number;
  sleepHours: number;
  recordDate: string;
}

export default function Stats() {
  const [records, setRecords] = useState<Record[]>([]);
  const { dark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/records').then(res => setRecords(res.data)).catch(() => navigate('/login'));
  }, []);

  const chartData = records.slice(0, 14).reverse().map(r => ({
    date: new Date(r.recordDate).toLocaleDateString('mk-MK', { day: 'numeric', month: 'short' }),
    Расположение: r.moodScore,
    Сон: r.sleepHours,
  }));

  const moodDist = [1, 2, 3, 4, 5].map(score => ({
    name: ['😢', '🙁', '😐', '🙂', '🤩'][score - 1],
    Број: records.filter(r => r.moodScore === score).length,
  }));

  const tooltipStyle = {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    background: dark ? '#1e293b' : '#ffffff',
    color: dark ? '#e2e8f0' : '#0f172a',
  };

  const gridColor = dark ? '#1e293b' : '#f1f5f9';
  const axisColor = dark ? '#475569' : '#94a3b8';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white transition-colors duration-300">Статистики 📊</h1>
        <p className="text-slate-400 mt-1">Следи го твојот напредок низ времето</p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-slate-400 font-semibold">Сè уште нема доволно податоци за графици.</p>
          <p className="text-slate-300 dark:text-slate-600 text-sm mt-1">Додај неколку check-ins прво!</p>
        </div>
      ) : (
        <>
          {/* Mood Graf */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 card-hover transition-colors duration-300">
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6 transition-colors duration-300">
              Расположение низ времето
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: axisColor }} />
                <YAxis domain={[1, 5]} tick={{ fontSize: 12, fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="Расположение"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#moodGrad)"
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#ec4899' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep Graf */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 card-hover transition-colors duration-300">
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6 transition-colors duration-300">
              Часови сон низ времето
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: axisColor }} />
                <YAxis tick={{ fontSize: 12, fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="Сон"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fill="url(#sleepGrad)"
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#8b5cf6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 card-hover transition-colors duration-300">
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6 transition-colors duration-300">
              Дистрибуција на расположение
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={moodDist}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fontSize: 20 }} />
                <YAxis tick={{ fontSize: 12, fill: axisColor }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="Број" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}