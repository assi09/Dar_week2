// Renders an inline [n] citation marker as a clickable badge with a hover
// tooltip showing the matching source's snippet (desktop only), and opens the
// matching source in SourceModal on click.
export default function CitationRef({ num, source, onOpen }) {
  if (!source) return <span>[{num}]</span>;

  return (
    <span className="relative inline-block group">
      <button
        onClick={onOpen}
        className="inline-flex items-center justify-center align-super text-[10px] font-semibold leading-none px-1 py-0.5 mx-0.5 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors"
      >
        {num}
      </button>
      <span className="hidden sm:block absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-1 w-56 p-2 rounded-lg bg-gray-900 text-white text-[11px] leading-snug opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg">
        <span className="block font-semibold mb-0.5">{source.section}, p.{source.page}</span>
        {source.snippet && <span className="block text-gray-300 line-clamp-3">{source.snippet}</span>}
      </span>
    </span>
  );
}
