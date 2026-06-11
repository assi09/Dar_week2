import { useState } from 'react';
import { Send } from 'lucide-react';

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer data-tour="input-bar" className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className={`flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm transition-opacity ${disabled ? 'opacity-60' : ''}`}>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Thinking...' : 'Ask about CIS Controls...'}
            className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !text.trim()}
            className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
