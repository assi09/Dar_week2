// Renders an inline [n] citation marker as a clickable badge that opens the
// matching source in SourceModal.
export default function CitationRef({ num, source, onOpen }) {
  if (!source) return <span>[{num}]</span>;

  return (
    <button
      onClick={onOpen}
      className="inline-flex items-center justify-center align-super text-[10px] font-semibold leading-none px-1 py-0.5 mx-0.5 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors"
    >
      {num}
    </button>
  );
}
