import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ThinkingBubble from './ThinkingBubble';

export default function ChatViewport({ messages, isThinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <main className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isThinking && <ThinkingBubble />}
      <div ref={bottomRef} />
    </main>
  );
}
