import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';

const BACKEND = 'http://localhost:8000';

const mdComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => className
    ? <pre className="bg-black/10 p-2 rounded text-xs font-mono overflow-x-auto my-1 whitespace-pre-wrap"><code>{children}</code></pre>
    : <code className="bg-black/10 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
};

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const [showSources, setShowSources] = useState(false);
  const [feedback, setFeedback] = useState(null);

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

      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}>
          {isUser ? (
            <p>{message.text}</p>
          ) : (
            <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {message.text}
            </Markdown>
          )}
          <span className={`text-xs mt-1 block ${isUser ? 'text-indigo-200 text-right' : 'text-gray-400'}`}>
            {message.time}
          </span>
        </div>

        {/* Sources + feedback row — only shown after streaming completes */}
        {!isUser && !message.isStreaming && (
          <div className="mt-1.5 w-full flex items-center gap-2">
            {message.sources?.length > 0 && (
              <button
                onClick={() => setShowSources(v => !v)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
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
              <div key={i} className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">{s.section}</span>
                <span className="text-gray-400 flex-shrink-0 ml-auto">p.{s.page}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold ml-3 flex-shrink-0 mt-1">
          U
        </div>
      )}
    </div>
  );
}
