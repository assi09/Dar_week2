import { useState } from 'react';
import { Plus, MessageSquare, Pencil, Trash2 } from 'lucide-react';

export default function Sidebar({ conversations, activeId, onSelect, onNewChat, onRename, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const startEditing = (c) => {
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const commitEdit = () => {
    const title = editTitle.trim();
    if (title && editingId) onRename(editingId, title);
    setEditingId(null);
  };

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
        {conversations.length > 0 && (
          <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Recent
          </p>
        )}
        {conversations.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">No conversations yet</p>
        )}
        {conversations.map(c => (
          <div
            key={c.id}
            className={`group flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              c.id === activeId
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {editingId === c.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitEdit();
                  if (e.key === 'Escape') setEditingId(null);
                }}
                onBlur={commitEdit}
                className="flex-1 min-w-0 bg-transparent border-b border-indigo-400 outline-none text-sm"
              />
            ) : (
              <>
                <button
                  onClick={() => onSelect(c.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left truncate"
                >
                  <MessageSquare size={14} className="flex-shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
                <button
                  onClick={() => startEditing(c)}
                  title="Rename"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors flex-shrink-0"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  title="Delete"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
