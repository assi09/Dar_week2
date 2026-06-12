import { useEffect, useState } from 'react';
import { Download, HelpCircle, Moon, Sun, Menu, FileText, FileDown, MessageSquare } from 'lucide-react';

const THEME_KEY = 'dar-theme';

export default function Header({ onExportMarkdown, onExportPdf, canExport, onToggleSidebar }) {
  const [isDark, setIsDark] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

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
    <header data-tour="header" className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="sm:hidden text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">Dar Chat</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(v => !v)}
            disabled={!canExport}
            title="Export conversation"
            className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 dark:disabled:hover:text-gray-500"
          >
            <Download size={18} />
          </button>
          {showExportMenu && canExport && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-44 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => { onExportMarkdown(); setShowExportMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText size={14} />
                  Markdown (.md)
                </button>
                <button
                  onClick={() => { onExportPdf(); setShowExportMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileDown size={14} />
                  PDF (.pdf)
                </button>
              </div>
            </>
          )}
        </div>
        <a
          href="/feedback"
          title="View feedback"
          className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
        >
          <MessageSquare size={18} />
        </a>
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
        <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">Week 2</span>
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
      </div>
    </header>
  );
}
