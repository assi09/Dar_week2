import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X } from 'lucide-react';
import remarkCitations from '../lib/remarkCitations';
import { baseMdComponents } from '../lib/markdownComponents';
import CitationRef from './CitationRef';

function VersionPane({ version, sources }) {
  if (!version) return null;
  return (
    <div className="flex-1 min-w-0 border border-gray-200 dark:border-gray-700 rounded-xl p-3 overflow-y-auto max-h-[50vh]">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
        Version {version.version_index}
      </p>
      <div className="text-sm leading-relaxed text-gray-800 dark:text-gray-100">
        <Markdown
          remarkPlugins={[remarkGfm, remarkCitations]}
          components={{
            ...baseMdComponents,
            citation: ({ num }) => <CitationRef num={num} source={sources?.[Number(num) - 1]} onOpen={() => {}} />,
          }}
        >
          {version.content}
        </Markdown>
      </div>
    </div>
  );
}

export default function CompareVersionsModal({ versions, activeVersion, onClose }) {
  const maxVersion = Math.max(...versions.map(v => v.version_index));
  const defaultLeft = activeVersion > 1 ? activeVersion - 1 : Math.min(2, maxVersion);

  const [leftIndex, setLeftIndex] = useState(defaultLeft);
  const [rightIndex, setRightIndex] = useState(activeVersion);

  const left = versions.find(v => v.version_index === leftIndex);
  const right = versions.find(v => v.version_index === rightIndex);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Compare versions</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <select
            value={leftIndex}
            onChange={(e) => setLeftIndex(Number(e.target.value))}
            className="text-xs rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-gray-700 dark:text-gray-200"
          >
            {versions.map(v => (
              <option key={v.version_index} value={v.version_index}>Version {v.version_index}</option>
            ))}
          </select>
          <select
            value={rightIndex}
            onChange={(e) => setRightIndex(Number(e.target.value))}
            className="text-xs rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-gray-700 dark:text-gray-200"
          >
            {versions.map(v => (
              <option key={v.version_index} value={v.version_index}>Version {v.version_index}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <VersionPane version={left} sources={left?.sources} />
          <VersionPane version={right} sources={right?.sources} />
        </div>
      </div>
    </div>
  );
}
