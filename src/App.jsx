import { useState } from 'react';
import Header from './components/Header';
import ChatViewport from './components/ChatViewport';
import InputBar from './components/InputBar';

const BACKEND = 'http://localhost:8000';

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGES = [
  {
    id: 0,
    role: 'assistant',
    text: "Hi! I'm your CIS Controls v8 assistant. Ask me anything about the security controls.",
    time: formatTime(),
    sources: [],
    runId: null,
    isStreaming: false,
  },
];

export default function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      text,
      time: formatTime(),
    }]);
    setIsThinking(true);

    const assistantId = Date.now() + 1;
    let assistantMsg = {
      id: assistantId,
      role: 'assistant',
      text: '',
      time: formatTime(),
      sources: [],
      runId: null,
      isStreaming: true,
    };

    try {
      const response = await fetch(`${BACKEND}/api/query/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          let data;
          try { data = JSON.parse(line.slice(6)); } catch { continue; }

          if (data.type === 'meta') {
            assistantMsg = { ...assistantMsg, runId: data.run_id, sources: data.sources };
            setIsThinking(false);
            setMessages(prev => [...prev, { ...assistantMsg }]);
          } else if (data.type === 'chunk') {
            assistantMsg = { ...assistantMsg, text: assistantMsg.text + data.content };
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...assistantMsg } : m));
          } else if (data.type === 'done') {
            assistantMsg = { ...assistantMsg, isStreaming: false };
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...assistantMsg } : m));
          }
        }
      }
    } catch {
      setIsThinking(false);
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        text: 'Could not reach the backend. Make sure the API server is running on port 8000.',
        time: formatTime(),
        sources: [],
        runId: null,
        isStreaming: false,
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <ChatViewport messages={messages} isThinking={isThinking} />
      <InputBar onSend={handleSend} disabled={isThinking} />
    </div>
  );
}
