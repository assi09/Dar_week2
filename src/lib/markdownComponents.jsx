// Shared react-markdown component overrides, reused by ChatMessage and
// CompareVersionsModal so both render assistant text identically.
export const baseMdComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children, className }) => className
    ? <pre className="bg-black/10 dark:bg-white/10 p-2 rounded text-xs font-mono overflow-x-auto my-1 whitespace-pre-wrap"><code>{children}</code></pre>
    : <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
};
