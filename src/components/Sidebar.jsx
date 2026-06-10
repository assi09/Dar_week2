import { Plus, MessageSquare } from 'lucide-react';

export default function Sidebar({ conversations, activeId, onSelect, onNewChat }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onNewChat}
          data-tour="new-chat"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      <div data-tour="sidebar-list" className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">No conversations yet</p>
        )}
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm truncate transition-colors ${
              c.id === activeId
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
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
