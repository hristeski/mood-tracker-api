import { useState, useEffect } from 'react';
import { CheckCircle2, PenLine } from 'lucide-react';
import api from '../api/axios';

const moodOptions = [
  { score: 1, icon: '😢', label: 'Тажно', active: 'bg-red-100 border-red-400 text-red-700', glow: 'shadow-red-200' },
  { score: 2, icon: '🙁', label: 'Стрес', active: 'bg-orange-100 border-orange-400 text-orange-700', glow: 'shadow-orange-200' },
  { score: 3, icon: '😐', label: 'Океј', active: 'bg-yellow-100 border-yellow-400 text-yellow-700', glow: 'shadow-yellow-200' },
  { score: 4, icon: '🙂', label: 'Добро', active: 'bg-emerald-100 border-emerald-400 text-emerald-700', glow: 'shadow-emerald-200' },
  { score: 5, icon: '🤩', label: 'Супер', active: 'bg-violet-100 border-violet-400 text-violet-700', glow: 'shadow-violet-200' },
];

const quotes = [
  { text: "Грижата за себе не е себичност.", author: "— Мудрост" },
  { text: "Секој ден е нова можност да почнеш.", author: "— Анонимно" },
  { text: "Твоето расположение е валидно.", author: "— Психологија" },
  { text: "Малите чекори водат до големи промени.", author: "— Наука" },
  { text: "Одморот е дел од продуктивноста.", author: "— Наука" },
  { text: "Ти си посилен отколку мислиш.", author: "— Мудрост" },
  { text: "Денес направи нешто убаво за себе.", author: "— Совет" },
];

export default function CheckIn({ onSaved }: { onSaved?: () => void }) {
  const [mood, setMood] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number>(7);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[idx]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;
    setError('');
    try {
      await api.post('/records', { moodScore: mood, sleepHours: sleep, notes });
      setSubmitted(true);
      onSaved?.();
      setTimeout(() => {
        setSubmitted(false);
        setMood(null);
        setSleep(7);
        setNotes('');
        setShowNotes(false);
        const newIdx = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[newIdx]);
      }, 3000);
    } catch {
      setError('Грешка при зачувување. Обиди се повторно.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
      {/* Цитат хедер */}
      <div className="gradient-animate p-5">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">Цитат на денот ✨</p>
        <p className="text-white font-bold text-base leading-relaxed">"{quote.text}"</p>
        <p className="text-white/60 text-xs mt-1">{quote.author}</p>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-5 transition-colors duration-300">
          Дневен Check-in
        </h2>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-4 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood избор */}
          <div>
            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 transition-colors duration-300">
              Како се чувствуваш денес?
            </label>
            <div className="flex justify-between gap-2">
              {moodOptions.map((m) => (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => setMood(m.score)}
                  className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                    mood === m.score
                      ? `${m.active} shadow-lg ${m.glow} scale-110`
                      : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105'
                  }`}
                >
                  <span className={`text-3xl mb-1 transition-all duration-300 ${mood === m.score ? 'scale-125' : ''}`}>
                    {m.icon}
                  </span>
                  <span className="text-xs font-bold dark:text-slate-300">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Сон слајдер */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl transition-colors duration-300">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-300 transition-colors duration-300">
                🌙 Часови сон
              </label>
              <span className="gradient-animate text-white py-1 px-3 rounded-full text-sm font-black shadow-md">
                {sleep}h
              </span>
            </div>
            <input
              type="range"
              min="0" max="14" step="0.5"
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
            />
            <div className="flex justify-between text-xs text-slate-300 dark:text-slate-600 mt-1 font-medium">
              <span>0h</span><span>7h</span><span>14h</span>
            </div>
          </div>

          {/* Белешки */}
          <div>
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 text-sm font-bold text-violet-500 hover:text-pink-500 transition-colors duration-200"
            >
              <PenLine size={16} />
              {showNotes ? 'Скриј белешки' : '+ Додај белешка (опционално)'}
            </button>
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Како помина денот? Нешто посебно да забележиш?..."
                rows={3}
                className="w-full mt-3 px-4 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-violet-400 transition-all duration-200 text-slate-700 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-600 text-sm resize-none animate-slide-up"
              />
            )}
          </div>

          {/* Submit копче */}
          <button
            type="submit"
            disabled={!mood || submitted}
            className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              submitted
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
                : mood
                  ? 'gradient-animate text-white hover:shadow-xl hover:scale-[1.02]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            {submitted ? (
              <><CheckCircle2 size={22} /> Зачувано! Браво! 🎉</>
            ) : (
              '💾 Зачувај го денот'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}