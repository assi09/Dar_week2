import { Plus, MessageSquare } from 'lucide-react';

export default function Sidebar({ conversations, activeId, onSelect, onNewChat }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">No conversations yet</p>
        )}
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm truncate transition-colors ${
              c.id === activeId
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={14} className="flex-shrink-0" />
            <span className="truncate">{c.title}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
