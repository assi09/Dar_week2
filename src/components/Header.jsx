import { useEffect, useState } from 'react';
import { HelpCircle, Moon, Sun } from 'lucide-react';

const THEME_KEY = 'dar-theme';

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = localStorage.getItem(THEME_KEY) === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  return (
    <header data-tour="header" className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Dar Chat</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          title="Toggle dark mode"
          className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          onClick={() => window.dispatchEvent(new Event('start-tour'))}
          title="Take the guided tour"
          className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
        >
          <HelpCircle size={18} />
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400">Week 2</span>
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
      </div>
    </header>
  );
}
