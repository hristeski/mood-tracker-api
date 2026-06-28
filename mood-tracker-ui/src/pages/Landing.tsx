import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Sparkles, Heart, TrendingUp, Shield } from 'lucide-react';

const floatingEmojis = [
  { emoji: '😊', top: '15%', left: '8%', anim: 'animate-float1', delay: '0s', size: 'text-5xl' },
  { emoji: '🌙', top: '25%', right: '10%', anim: 'animate-float2', delay: '0.5s', size: 'text-4xl' },
  { emoji: '⭐', top: '60%', left: '5%', anim: 'animate-float3', delay: '1s', size: 'text-3xl' },
  { emoji: '🎯', top: '70%', right: '8%', anim: 'animate-float1', delay: '1.5s', size: 'text-4xl' },
  { emoji: '💜', top: '40%', left: '3%', anim: 'animate-float2', delay: '0.8s', size: 'text-3xl' },
  { emoji: '🌸', top: '80%', right: '15%', anim: 'animate-float3', delay: '0.3s', size: 'text-4xl' },
  { emoji: '✨', top: '10%', right: '25%', anim: 'animate-float1', delay: '1.2s', size: 'text-3xl' },
  { emoji: '🔥', top: '50%', right: '3%', anim: 'animate-float2', delay: '0.6s', size: 'text-4xl' },
];

const features = [
  { icon: <Heart size={28} />, title: 'Следи го расположението', desc: 'Дневни check-ins со 5 нивоа на расположение и квалитет на сон', color: 'from-pink-500 to-rose-500' },
  { icon: <TrendingUp size={28} />, title: 'Гледај го напредокот', desc: 'Интерактивни графици кои покажуваат трендови низ времето', color: 'from-violet-500 to-purple-500' },
  { icon: <Sparkles size={28} />, title: 'Дневна мотивација', desc: 'Цитати и предизвици кои те инспирираат секој ден', color: 'from-amber-500 to-orange-500' },
  { icon: <Shield size={28} />, title: 'Приватно и безбедно', desc: 'Твоите податоци се заштитени со JWT автентикација', color: 'from-emerald-500 to-teal-500' },
];

const quotes = [
  "Секој ден е нова можност да се грижиш за себе. 💜",
  "Малите чекори водат до големи промени. 🌱",
  "Твоето ментално здравје е приоритет. 🧠",
  "Грижата за себе не е себичност — тоа е нужност. ✨",
];

export default function Landing() {
  const navigate = useNavigate();
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setQuoteIdx(i => (i + 1) % quotes.length), 4000);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => { clearInterval(interval); window.removeEventListener('scroll', handleScroll); };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 gradient-animate opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

        {/* Parallax орбитални кругови */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10 animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/15" style={{ animation: 'spin-slow 15s linear infinite reverse' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 animate-spin-slow" style={{ animationDuration: '30s' }}></div>
        </div>

        {/* Floating емоџи */}
        {floatingEmojis.map((e, i) => (
          <div
            key={i}
            className={`absolute ${e.anim} ${e.size} select-none pointer-events-none filter drop-shadow-lg`}
            style={{ top: e.top, left: e.left, right: e.right, animationDelay: e.delay, transform: `translateY(${scrollY * 0.1 * (i % 3 + 1)}px)` }}
          >
            {e.emoji}
          </div>
        ))}

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-xl animate-pulse-glow">
              🧠
            </div>
            <span className="text-white font-black text-xl">МoodTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="glass text-white px-5 py-2.5 rounded-2xl font-semibold text-sm hover:bg-white/25 transition-all duration-200"
            >
              Најава
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-violet-600 px-5 py-2.5 rounded-2xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Започни бесплатно
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
          {/* Rotating quote badge */}
          <div className="glass text-white/90 px-5 py-2.5 rounded-full text-sm font-medium mb-8 animate-slide-up max-w-md">
            <span key={quoteIdx} className="animate-fade-in block">{quotes[quoteIdx]}</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
            Грижи се за
            <br />
            <span className="relative">
              <span className="relative z-10">
                <TypeAnimation
                  sequence={['умот', 1500, 'душата', 1500, 'себе', 1500, 'здравјето', 1500]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-yellow-300"
                />
              </span>
            </span>
          </h1>

          <p className="text-white/80 text-xl md:text-2xl font-medium mb-10 max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Следи го своето расположение, сонот и благосостојбата секој ден. 
            Открај трендови и изгради подобри навики.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/register')}
              className="group bg-white text-violet-600 px-8 py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              Започни денес — бесплатно
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="glass text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/25 transition-all duration-300"
            >
              Дознај повеќе ↓
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[['100%', 'Приватно'], ['∞', 'Записи'], ['5⭐', 'Расположенија']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black text-white">{val}</p>
                <p className="text-white/60 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-slate-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-slate-800 mb-4">
              Зошто <span className="shimmer-text">МoodTracker</span>?
            </h2>
            <p className="text-slate-400 text-xl">Сè што ти треба за подобра благосостојба</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-slate-100 card-hover animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 gradient-animate opacity-90"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6">Подготвен да започнеш?</h2>
          <p className="text-white/80 text-xl mb-10">Придружи се и започни да го следиш своето ментално здравје денес.</p>
          <button
            onClick={() => navigate('/register')}
            className="group bg-white text-violet-600 px-10 py-5 rounded-2xl font-black text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            Создај профил — бесплатно
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center">
        <p className="font-medium">© 2026 МoodTracker — Направено со 💜 за подобро ментално здравје</p>
      </footer>
    </div>
  );
}