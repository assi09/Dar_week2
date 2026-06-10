import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ThinkingBubble from './ThinkingBubble';
import SuggestedQuestions from './SuggestedQuestions';

const NEAR_BOTTOM_THRESHOLD = 100; // px

export default function ChatViewport({ messages, isThinking, onSuggestionClick }) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const stickToBottom = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

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
        className="absolute inset-0 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-900"
      >
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {messages.length === 1 && messages[0].id === 0 && !isThinking && (
          <SuggestedQuestions onSelect={onSuggestionClick} />
        )}
        {isThinking && <ThinkingBubble />}
        <div ref={bottomRef} />
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
