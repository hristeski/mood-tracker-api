import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, CalendarDays, LogOut, Activity, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
    onClose();
  };

  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/stats', icon: <BarChart3 size={20} />, label: 'Статистики' },
    { to: '/history', icon: <CalendarDays size={20} />, label: 'Историја' },
  ];

  return (
    <>
      {/* Overlay за мобилна */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-full w-64 z-40
        bg-white dark:bg-slate-900
        border-r border-slate-100 dark:border-slate-800
        flex flex-col shadow-xl
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Лого */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-animate rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Activity size={20} className="text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-800 dark:text-white">МoodTracker</span>
                <p className="text-xs text-slate-400 font-medium">Wellbeing App</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Навигација */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'gradient-animate text-white shadow-lg'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Dark mode toggle + корисник */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={toggle}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 mb-3"
          >
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
              {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-violet-400" />}
              {dark ? 'Светла тема' : 'Темна тема'}
            </span>
            <div className={`relative w-11 h-6 rounded-full transition-all duration-300 ${dark ? 'gradient-animate' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${dark ? 'left-5' : 'left-0.5'}`}></div>
            </div>
          </button>

          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-xl gradient-animate flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              {(localStorage.getItem('username') || 'К')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                {localStorage.getItem('username') || 'Корисник'}
              </p>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
                Активен
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-200"
          >
            <LogOut size={18} />
            Одјави се
          </button>
        </div>
      </aside>
    </>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile топ бар */}
        <header className="lg:hidden sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-animate rounded-lg flex items-center justify-center">
              <Activity size={14} className="text-white" />
            </div>
            <span className="font-black text-slate-800 dark:text-white text-sm">МoodTracker</span>
          </div>
          <div className="w-9 h-9 rounded-xl gradient-animate flex items-center justify-center text-white font-bold text-sm shadow-md">
            {(localStorage.getItem('username') || 'К')[0].toUpperCase()}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><AppLayout><Stats /></AppLayout></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><AppLayout><History /></AppLayout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}