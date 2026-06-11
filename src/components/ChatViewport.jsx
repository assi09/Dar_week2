import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ThinkingBubble from './ThinkingBubble';
import SuggestedQuestions from './SuggestedQuestions';

const NEAR_BOTTOM_THRESHOLD = 100; // px

export default function ChatViewport({ messages, isThinking, onSuggestionClick, onRegenerate }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const stickToBottom = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isEmpty = messages.length === 1 && messages[0].id === 0;

  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM_THRESHOLD;
  };

  const scrollToBottom = (behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
    stickToBottom.current = true;
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    const nearBottom = isNearBottom();
    stickToBottom.current = nearBottom;
    setShowScrollButton(!nearBottom);
  };

  // Auto-scroll as new messages/chunks arrive, but only if the user is
  // already near the bottom — otherwise leave them where they are.
  useEffect(() => {
    if (stickToBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowScrollButton(true);
    }
  }, [messages, isThinking]);

  return (
    <div className="relative flex-1 min-h-0">
      <main
        ref={containerRef}
        onScroll={handleScroll}
        data-tour="chat-viewport"
        className="absolute inset-0 overflow-y-auto bg-gray-50 dark:bg-gray-900"
      >
        <div className={`max-w-3xl mx-auto px-6 py-6 min-h-full flex flex-col ${isEmpty ? 'justify-center' : ''}`}>
          {isEmpty ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-5 shadow-lg shadow-indigo-600/20">
                D
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Hi! I'm Dar, your CIS Controls v8 assistant
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Ask me anything about the security controls, or try one of these:
              </p>
              <SuggestedQuestions onSelect={onSuggestionClick} />
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} onRegenerate={onRegenerate} />
              ))}
              {isThinking && <ThinkingBubble />}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          aria-label="Scroll to bottom"
          className="absolute bottom-4 right-6 w-9 h-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors"
        >
          <ArrowDown size={16} />
        </button>
      )}
    </div>
  );
}
