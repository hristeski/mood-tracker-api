type MoodButtonProps = {
  label: string;
  emoji: string;
  onClick?: () => void;
  selected?: boolean;
};

export function MoodButton({ label, emoji, onClick, selected = false }: MoodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-3xl border px-4 py-5 text-center transition ${
        selected
          ? 'border-indigo-500 bg-indigo-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-indigo-300'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

export default function Dashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* 1. Поздрав и Прогрес */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold">Здраво, [Име]! 👋</h1>
        <p className="opacity-90 mt-2">Твојот стрики на добросостојба: <span className="font-bold text-yellow-300">5 дена</span> 🔥</p>
      </section>

      {/* 2. Брза акција */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Дневен Check-in</h2>
          <div className="flex justify-between">
            {/* Тука ќе ги рендерираме нашите MoodButton компоненти */}
          </div>
        </div>

        {/* 3. Дневен Предизвик (Гемификација) */}
        <div className="bg-yellow-50 p-6 rounded-3xl shadow-sm border border-yellow-100">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Дневен Предизвик ✨</h2>
          <p className="text-yellow-700 italic">"Исклучи го телефонот 1 час пред спиење за подобар квалитет на сон."</p>
        </div>
      </section>

      {/* 4. Интерактивен График (Placeholder) */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Твојот прогрес во неделата</h2>
        <div className="h-48 flex items-end justify-between px-4">
          {/* Овде подоцна ќе додадеме Recharts */}
        </div>
      </section>
    </div>
  );
}