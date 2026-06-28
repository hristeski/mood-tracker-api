import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckIn from '../components/CheckIn';
import Heatmap from '../components/Heatmap';
import api from '../api/axios';
import { TrendingUp, Moon, Flame, Smile, Award, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Record {
  id: number;
  moodScore: number;
  sleepHours: number;
  recordDate: string;
}

const moodEmoji: { [key: number]: string } = { 1: '😢', 2: '🙁', 3: '😐', 4: '🙂', 5: '🤩' };
const moodLabel: { [key: number]: string } = { 1: 'Тажно', 2: 'Стрес', 3: 'Океј', 4: 'Добро', 5: 'Супер' };
const moodGrad: { [key: number]: string } = {
  1: 'from-red-400 to-pink-500',
  2: 'from-orange-400 to-amber-500',
  3: 'from-yellow-400 to-orange-400',
  4: 'from-emerald-400 to-teal-500',
  5: 'from-violet-500 to-pink-500',
};

const challenges = [
  "Попиј 8 чаши вода денес 💧",
  "Исклучи телефонот 1 час пред спиење 📵",
  "Направи 10 мин медитација 🧘",
  "Оди на прошетка 20 мин денес 🚶",
  "Напиши 3 работи за кои си благодарен 📝",
  "Јади здрав оброк денес 🥗",
  "Јави се на некој близок 📞",
];

const timeOfDay = () => {
  const h = new Date().getHours();
  if (h < 12) return { greet: 'Добро утро', emoji: '☀️' };
  if (h < 18) return { greet: 'Добар ден', emoji: '🌤️' };
  return { greet: 'Добра вечер', emoji: '🌙' };
};

export default function Dashboard() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Корисник';
  const challenge = challenges[new Date().getDay() % challenges.length];
  const { greet, emoji } = timeOfDay();

  const fetchRecords = async () => {
    try {
      const res = await api.get('/records');
      setRecords(res.data);
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const avgMood = records.length
    ? (records.slice(0, 7).reduce((a, r) => a + r.moodScore, 0) / Math.min(records.length, 7)).toFixed(1)
    : null;

  const avgSleep = records.length
    ? (records.slice(0, 7).reduce((a, r) => a + r.sleepHours, 0) / Math.min(records.length, 7)).toFixed(1)
    : null;

  const streak = records.length;

  const getBadge = () => {
    if (streak >= 30) return { label: '🏆 Легенда', color: 'from-yellow-400 to-amber-500' };
    if (streak >= 14) return { label: '💎 Дијамант', color: 'from-cyan-400 to-blue-500' };
    if (streak >= 7) return { label: '🔥 На оган', color: 'from-orange-400 to-red-500' };
    if (streak >= 3) return { label: '⭐ Ѕвезда', color: 'from-violet-400 to-pink-500' };
    return { label: '🌱 Почетник', color: 'from-emerald-400 to-teal-500' };
  };

  const badge = getBadge();

  const stats = [
    {
      label: 'Вкупно записи',
      value: records.length,
      sub: 'денови активен',
      icon: <Flame size={22} />,
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-500',
    },
    {
      label: 'Просечно расп.',
      value: avgMood ? `${avgMood}/5` : '—',
      sub: avgMood ? (Number(avgMood) >= 4 ? 'Одлично!' : Number(avgMood) >= 3 ? 'Добро' : 'Може подобро') : 'Нема податоци',
      icon: <Smile size={22} />,
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      text: 'text-violet-500',
    },
    {
      label: 'Просечен сон',
      value: avgSleep ? `${avgSleep}h` : '—',
      sub: avgSleep ? (Number(avgSleep) >= 7 ? 'Идеално!' : 'Пробај повеќе') : 'Нема податоци',
      icon: <Moon size={22} />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-500',
    },
    {
      label: 'Статус',
      value: badge.label,
      sub: streak >= 7 ? 'Продолжи така!' : `Уште ${7 - streak} до 🔥`,
      icon: <Award size={22} />,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-500',
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium">Се вчитува...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">

      {/* Hero поздрав */}
      <div className="relative overflow-hidden gradient-animate rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-violet-200 dark:shadow-violet-900/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{emoji}</span>
              <span className="text-white/70 font-semibold text-sm md:text-base">{greet},</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">{username}! 👋</h1>
            <p className="text-white/80 text-sm md:text-lg max-w-md">
              {records.length === 0 ? 'Добредојде! Направи го твојот прв check-in денес.' : `Имаш ${records.length} ${records.length === 1 ? 'запис' : 'записи'}. Продолжи со одличната работа!`}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className={`bg-gradient-to-br ${badge.color} rounded-2xl p-4 md:p-5 text-center shadow-lg min-w-[120px]`}>
              <p className="text-2xl md:text-3xl font-black text-white">{streak}</p>
              <p className="text-white/80 text-xs font-semibold mt-1">записи</p>
              <div className="mt-2 bg-white/20 rounded-xl px-2 py-1"><p className="text-white text-xs font-bold">{badge.label}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистики */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl p-4 md:p-5 border border-slate-100 dark:border-slate-800 card-hover animate-slide-up transition-colors duration-300" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`w-10 h-10 md:w-11 md:h-11 ${s.bg} rounded-xl md:rounded-2xl flex items-center justify-center ${s.text} mb-3`}>{s.icon}</div>
            <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight">{s.value}</p>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">{s.label}</p>
            <p className="text-xs text-slate-300 dark:text-slate-600 mt-1 font-medium">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Check-in и Предизвик/Heatmap */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CheckIn onSaved={fetchRecords} />
        </div>

        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Heatmap />
          
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 md:p-6 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900/20 card-hover">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center"><Calendar size={16} className="text-white" /></div>
              <p className="text-amber-100 font-bold text-sm">Дневен Предизвик</p>
            </div>
            <p className="text-lg md:text-xl font-black leading-relaxed">{challenge}</p>
          </div>

          {records.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <p className="font-black text-slate-700 dark:text-slate-200 text-sm">Последни записи</p>
                <Link to="/history" className="text-violet-500 text-xs font-bold flex items-center gap-1 hover:text-pink-500 transition-colors">Сите <ArrowRight size={12} /></Link>
              </div>
              <div className="space-y-2">
                {records.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl transition-colors duration-300">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${moodGrad[r.moodScore]} flex items-center justify-center text-lg flex-shrink-0`}>{moodEmoji[r.moodScore]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{moodLabel[r.moodScore]}</p>
                      <p className="text-slate-400 text-xs">🌙 {r.sleepHours}h сон</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}