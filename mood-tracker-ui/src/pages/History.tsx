import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, StickyNote } from 'lucide-react';
import api from '../api/axios';

interface Record {
  id: number;
  moodScore: number;
  sleepHours: number;
  notes?: string;
  recordDate: string;
}

const moodEmoji: { [k: number]: string } = { 1: '😢', 2: '🙁', 3: '😐', 4: '🙂', 5: '🤩' };
const moodLabel: { [k: number]: string } = { 1: 'Тажно', 2: 'Стрес', 3: 'Океј', 4: 'Добро', 5: 'Супер' };
const moodGrad: { [k: number]: string } = {
  1: 'from-red-400 to-pink-500',
  2: 'from-orange-400 to-amber-500',
  3: 'from-yellow-400 to-orange-400',
  4: 'from-emerald-400 to-teal-500',
  5: 'from-violet-500 to-pink-500',
};

export default function History() {
  const [records, setRecords] = useState<Record[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/records').then(res => setRecords(res.data)).catch(() => navigate('/login'));
  }, []);

  const filtered = filter ? records.filter(r => r.moodScore === filter) : records;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white transition-colors duration-300">
          Историја 📅
        </h1>
        <p className="text-slate-400 mt-1">Сите твои минати check-ins</p>
      </div>

      {/* Филтер */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 ${
            filter === null
              ? 'gradient-animate text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Сите ({records.length})
        </button>
        {[5, 4, 3, 2, 1].map(score => (
          <button
            key={score}
            onClick={() => setFilter(filter === score ? null : score)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 ${
              filter === score
                ? 'gradient-animate text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {moodEmoji[score]} {records.filter(r => r.moodScore === score).length}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-16 text-center border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-slate-400 font-semibold">Нема записи за овој филтер.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <div
              key={r.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 card-hover overflow-hidden animate-slide-up transition-colors duration-300"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${moodGrad[r.moodScore]} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                  {moodEmoji[r.moodScore]}
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-800 dark:text-white text-lg transition-colors duration-300">
                    {moodLabel[r.moodScore]}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-slate-400 text-sm">🌙 {r.sleepHours}h сон</span>
                    {r.notes && (
                      <span className="flex items-center gap-1 text-violet-400 text-xs font-semibold">
                        <StickyNote size={12} /> Има белешка
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {new Date(r.recordDate).toLocaleDateString('mk-MK', { day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-xs text-slate-300 dark:text-slate-600">
                    {new Date(r.recordDate).toLocaleDateString('mk-MK', { weekday: 'long' })}
                  </p>
                  {r.notes && (
                    expanded === r.id
                      ? <ChevronUp size={16} className="text-slate-300 dark:text-slate-600" />
                      : <ChevronDown size={16} className="text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              </div>

              {/* Белешка expandable */}
              {expanded === r.id && r.notes && (
                <div className="px-5 pb-5 animate-slide-up">
                  <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-4 border border-violet-100 dark:border-violet-800 transition-colors duration-300">
                    <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <StickyNote size={12} /> Белешка
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{r.notes}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}