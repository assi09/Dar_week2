import { useState } from 'react';
import { BookOpen, Check, Copy, X } from 'lucide-react';

export default function SourceModal({ source, onClose, onViewDocument }) {
  const [copied, setCopied] = useState(false);
  if (!source) return null;

  const citation = `CIS Controls v8 — ${source.section}, p.${source.page}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Source</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{source.section}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">CIS Controls v8 — Page {source.page}</p>
        {source.snippet && (
          <blockquote className="text-xs text-gray-500 dark:text-gray-400 border-l-2 border-indigo-300 dark:border-indigo-600 pl-3 mb-4 italic">
            "{source.snippet}"
          </blockquote>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied citation' : 'Copy citation'}
          </button>
          {source.file && onViewDocument && (
            <button
              onClick={onViewDocument}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <BookOpen size={13} />
              View in document
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
