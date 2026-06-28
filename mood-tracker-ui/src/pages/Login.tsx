import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      navigate('/dashboard');
    } catch {
      setError('Погрешен е-маил или лозинка. Обиди се повторно.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Лева страна — анимирана */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-center justify-center">
        <div className="absolute inset-0 gradient-animate"></div>
        <div className="absolute inset-0">
          {['😊', '🌙', '⭐', '💜', '🔥', '✨', '🌸', '🎯'].map((e, i) => (
            <div
              key={i}
              className={`absolute text-4xl select-none animate-float${(i % 3) + 1}`}
              style={{
                top: `${10 + (i * 11) % 80}%`,
                left: `${5 + (i * 17) % 85}%`,
                animationDelay: `${i * 0.4}s`,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
              }}
            >
              {e}
            </div>
          ))}
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="text-8xl mb-6 animate-bounce-in">🧠</div>
          <h2 className="text-4xl font-black text-white mb-4">Добредојде назад!</h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Продолжи со следење на твоето расположение и благосостојба.
          </p>
          <div className="mt-8 glass rounded-3xl p-6 text-left">
            <p className="text-white/60 text-sm font-medium mb-1">Денешен цитат</p>
            <p className="text-white font-semibold text-lg">"Секој ден е нова можност. 💜"</p>
          </div>
        </div>
      </div>

      {/* Десна страна — форма */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-medium text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Назад на почетна
          </button>

          <div className="mb-8">
            <div className="text-4xl mb-3">👋</div>
            <h1 className="text-3xl font-black text-slate-800">Најави се</h1>
            <p className="text-slate-400 mt-2">Внеси ги твоите податоци за да продолжиш</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-medium flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 gradient-animate text-white rounded-2xl font-black text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:scale-100 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Се најавува...
                </span>
              ) : '🚀 Најави се'}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-8 text-sm">
            Немаш профил?{' '}
            <Link to="/register" className="text-violet-600 font-bold hover:text-pink-500 transition-colors">
              Регистрирај се бесплатно →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}