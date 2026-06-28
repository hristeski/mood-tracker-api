import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import api from '../api/axios';

const benefits = [
  'Дневни check-ins за расположение',
  'Интерактивни графици и статистики',
  'Дневни мотивациски цитати',
  'Белешки за секој запис',
  '100% приватно и безбедно',
];

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Лозинката мора да има минимум 6 знаци.'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/login');
    } catch {
      setError('Корисник со овој е-маил веќе постои.');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-yellow-400', 'bg-emerald-400'];
  const strengthLabels = ['', 'Слаба', 'Средна', 'Силна'];

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Лева страна — форма */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Назад на почетна
          </button>

          <div className="mb-8">
            <div className="text-4xl mb-3">🌟</div>
            <h1 className="text-3xl font-black text-slate-800">Создај профил</h1>
            <p className="text-slate-400 mt-2">Само 30 секунди и си готов!</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Корисничко име</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Твоето ime"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:outline-none focus:border-violet-400 transition-all duration-200 text-slate-800 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Е-маил адреса</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tvojmail@example.com"
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:outline-none focus:border-violet-400 transition-all duration-200 text-slate-800 font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">Лозинка</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 знаци"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:outline-none focus:border-violet-400 transition-all duration-200 text-slate-800 font-medium pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-slate-200'}`}></div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gradient-animate text-white rounded-2xl font-black text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:scale-100 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Се регистрира...
                </span>
              ) : '✨ Создај профил бесплатно'}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Веќе имаш профил?{' '}
            <Link to="/login" className="text-violet-600 font-bold hover:text-pink-500 transition-colors">
              Најави се →
            </Link>
          </p>
        </div>
      </div>

      {/* Десна страна */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center">
        <div className="absolute inset-0 gradient-animate"></div>
        <div className="absolute inset-0">
          {['🌙', '⭐', '💜', '🔥', '✨', '😊', '🌸', '🎯'].map((e, i) => (
            <div
              key={i}
              className={`absolute text-4xl select-none animate-float${(i % 3) + 1}`}
              style={{ top: `${10 + (i * 11) % 80}%`, left: `${5 + (i * 17) % 85}%`, animationDelay: `${i * 0.4}s` }}
            >
              {e}
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="text-8xl mb-6 animate-bounce-in">🚀</div>
          <h2 className="text-4xl font-black text-white mb-6">Со МoodTracker добиваш:</h2>
          <div className="space-y-3 text-left">
            {benefits.map((b, i) => (
              <div key={i} className="glass rounded-2xl px-5 py-3 flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-white" />
                </div>
                <span className="text-white font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}