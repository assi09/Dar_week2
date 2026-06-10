import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatViewport from './components/ChatViewport';
import InputBar from './components/InputBar';
import Tour from './components/Tour';

const BACKEND = 'http://localhost:8000';

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const WELCOME_MESSAGE = {
  id: 0,
  role: 'assistant',
  text: "Hi! I'm your CIS Controls v8 assistant. Ask me anything about the security controls.",
  time: formatTime(),
  sources: [],
  runId: null,
  isStreaming: false,
};

function mapMessage(m) {
  return {
    id: m.id,
    role: m.role,
    text: m.content,
    time: formatTime(new Date(m.created_at)),
    sources: m.sources || [],
    runId: m.run_id,
    isStreaming: false,
  };
}

export default function App() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isThinking, setIsThinking] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  const refreshConversations = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/conversations`);
      if (res.ok) setConversations(await res.json());
    } catch {}
  };

  useEffect(() => {
    refreshConversations();
  }, []);

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([WELCOME_MESSAGE]);
  };

  const handleSelectConversation = async (id) => {
    try {
      const res = await fetch(`${BACKEND}/api/conversations/${id}`);
      if (!res.ok) return;
      const convo = await res.json();
      setConversationId(convo.id);
      setMessages(convo.messages.length > 0 ? convo.messages.map(mapMessage) : [WELCOME_MESSAGE]);
    } catch {}
  };

  const handleRenameConversation = async (id, title) => {
    try {
      const res = await fetch(`${BACKEND}/api/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (res.ok) refreshConversations();
    } catch {}
  };

  const handleDeleteConversation = async (id) => {
    if (!window.confirm('Delete this conversation? This cannot be undone.')) return;
    try {
      const res = await fetch(`${BACKEND}/api/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (id === conversationId) handleNewChat();
        refreshConversations();
      }
    } catch {}
  };

  const handleExport = () => {
    const convo = conversations.find(c => c.id === conversationId);
    const title = convo?.title || 'Dar Chat conversation';
    const lines = [`# ${title}`, `_Exported on ${new Date().toLocaleString()}_`, ''];

    for (const m of messages) {
      if (m.role === 'user') {
        lines.push(`**You:** ${m.text}`, '');
      } else {
        lines.push(`**Dar:** ${m.text}`);
        if (m.sources?.length) {
          lines.push('', 'Sources:');
          for (const s of m.sources) lines.push(`- ${s.section} (p.${s.page})`);
        }
        lines.push('');
      }
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^\w\- ]/g, '').trim().slice(0, 50) || 'conversation'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        body: JSON.stringify({ question: text, conversation_id: conversationId }),
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
            if (!conversationId) setConversationId(data.conversation_id);
          } else if (data.type === 'chunk') {
            assistantMsg = { ...assistantMsg, text: assistantMsg.text + data.content };
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...assistantMsg } : m));
          } else if (data.type === 'done') {
            assistantMsg = { ...assistantMsg, isStreaming: false };
            setMessages(prev => prev.map(m => m.id === assistantId ? { ...assistantMsg } : m));
            refreshConversations();
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
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Tour />
      <Sidebar
        conversations={conversations}
        activeId={conversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onRename={handleRenameConversation}
        onDelete={handleDeleteConversation}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <Header onExport={handleExport} canExport={messages.length > 1 || messages[0].id !== 0} />
        <ChatViewport messages={messages} isThinking={isThinking} onSuggestionClick={handleSend} />
        <InputBar onSend={handleSend} disabled={isThinking} />
      </div>
    </div>
  );
}
