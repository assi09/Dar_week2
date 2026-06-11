import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkCitations from '../lib/remarkCitations';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Copy, Check, RotateCcw } from 'lucide-react';
import SourceModal from './SourceModal';
import CitationRef from './CitationRef';

const BACKEND = 'http://localhost:8000';

const baseMdComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => className
    ? <pre className="bg-black/10 dark:bg-white/10 p-2 rounded text-xs font-mono overflow-x-auto my-1 whitespace-pre-wrap"><code>{children}</code></pre>
    : <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
};

export default function ChatMessage({ message, onRegenerate, onSwitchVersion }) {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [versions, setVersions] = useState(null);

  useEffect(() => {
    if (isUser || message.isStreaming || message.versionCount <= 1 || !message.dbId) return;
    let cancelled = false;
    fetch(`${BACKEND}/api/messages/${message.dbId}/versions`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (!cancelled && data) setVersions(data.versions); })
      .catch(() => null);
    return () => { cancelled = true; };
  }, [isUser, message.isStreaming, message.versionCount, message.dbId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleFeedback = async (score) => {
    if (feedback !== null || !message.runId) return;
    setFeedback(score);
    try {
      await fetch(`${BACKEND}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_id: message.runId, score, comment: '' }),
      });
    } catch {}
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">
          D
        </div>
      )}

      <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm'
        }`}>
          {isUser ? (
            <p>{message.text}</p>
          ) : (
            <Markdown
              remarkPlugins={[remarkGfm, remarkCitations]}
              components={{
                ...baseMdComponents,
                citation: ({ num }) => (
                  <CitationRef
                    num={num}
                    source={message.sources?.[Number(num) - 1]}
                    onOpen={() => setSelectedSource(message.sources[Number(num) - 1])}
                  />
                ),
              }}
            >
              {message.text}
            </Markdown>
          )}
          <span className={`text-xs mt-1 block ${isUser ? 'text-indigo-200 text-right' : 'text-gray-400 dark:text-gray-500'}`}>
            {message.time}
          </span>
        </div>

        {/* Sources + feedback row — only shown after streaming completes */}
        {!isUser && !message.isStreaming && (
          <div className="mt-1.5 w-full flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy response"
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            {message.versionCount > 1 && versions && (
              <div className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500">
                <button
                  onClick={() => onSwitchVersion(message.id, message.activeVersion - 1, versions)}
                  disabled={message.activeVersion <= 1}
                  className="p-0.5 rounded hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                  <ChevronLeft size={12} />
                </button>
                <span>{message.activeVersion}/{message.versionCount}</span>
                <button
                  onClick={() => onSwitchVersion(message.id, message.activeVersion + 1, versions)}
                  disabled={message.activeVersion >= message.versionCount}
                  className="p-0.5 rounded hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            )}
            {message.runId && onRegenerate && (
              <button
                onClick={() => onRegenerate(message.id)}
                title="Regenerate response"
                className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <RotateCcw size={12} />
                Regenerate
              </button>
            )}
            {message.sources?.length > 0 && (
              <button
                onClick={() => setShowSources(v => !v)}
                className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
              </button>
            )}
            {message.runId && (
              <div className="flex items-center gap-1.5 ml-auto">
                {feedback !== null ? (
                  <span className="text-xs text-gray-400 italic">Feedback received</span>
                ) : (
                  <>
                    <button
                      onClick={() => handleFeedback(1)}
                      className="p-1 rounded text-gray-300 hover:text-green-400 transition-colors"
                    >
                      <ThumbsUp size={13} />
                    </button>
                    <button
                      onClick={() => handleFeedback(0)}
                      className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <ThumbsDown size={13} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Expanded sources list */}
        {showSources && message.sources?.length > 0 && (
          <div className="mt-1 flex flex-col gap-1 w-full">
            {message.sources.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedSource(s)}
                className="flex flex-col gap-0.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-left hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center text-[10px] font-semibold leading-none w-3.5 h-3.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 truncate">{s.section}</span>
                  <span className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-auto">p.{s.page}</span>
                </div>
                {s.snippet && (
                  <p className="text-gray-400 dark:text-gray-500 text-[11px] mt-0.5 pl-5 line-clamp-2">{s.snippet}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold ml-3 flex-shrink-0 mt-1">
          U
        </div>
      )}

      <SourceModal source={selectedSource} onClose={() => setSelectedSource(null)} />
    </div>
  );
}
