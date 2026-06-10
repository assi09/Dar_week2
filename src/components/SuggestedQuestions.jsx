const SUGGESTIONS = [
  'What does Control 8 say about audit log retention?',
  'What are the safeguards under Control 12?',
  'How should we manage an inventory of enterprise assets?',
  'What does Control 6 require for access control management?',
];

export default function SuggestedQuestions({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="text-left text-sm px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
