import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import '../lib/pdfWorker';

const BACKEND = 'http://localhost:8000';

function highlightSnippet(snippet) {
  const cleaned = (snippet || '').replace(/^…\s*/, '').replace(/\s*…$/, '').trim();
  return ({ str }) => {
    const trimmed = str.trim();
    if (cleaned && trimmed.length > 3 && cleaned.includes(trimmed)) {
      return `<mark class="bg-yellow-300/70 dark:bg-yellow-500/40 rounded-sm">${str}</mark>`;
    }
    return str;
  };
}

export default function DocumentViewer({ source, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(Number(source?.page) || 1);
  const [trackedSource, setTrackedSource] = useState(source);

  if (source !== trackedSource) {
    setTrackedSource(source);
    setPageNumber(Number(source?.page) || 1);
    setNumPages(null);
  }

  if (!source?.file) return null;

  const fileUrl = `${BACKEND}/documents/${encodeURIComponent(source.file)}`;
  const customTextRenderer = highlightSnippet(source.snippet);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-5 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{source.section}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              CIS Controls v8 — Page {pageNumber}{numPages ? ` of ${numPages}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-2">
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex items-center justify-center h-64 text-gray-400">
                <Loader2 className="animate-spin" size={24} />
              </div>
            }
            error={<p className="text-sm text-red-400 p-4">Could not load the source document.</p>}
          >
            <Page
              pageNumber={pageNumber}
              width={520}
              customTextRenderer={customTextRenderer}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            <ChevronLeft size={14} />
            Prev
          </button>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Page {pageNumber}{numPages ? ` / ${numPages}` : ''}
          </span>
          <button
            onClick={() => setPageNumber(p => (numPages ? Math.min(numPages, p + 1) : p + 1))}
            disabled={numPages != null && pageNumber >= numPages}
            className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>

        {source.snippet && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 italic">
            Highlighted text is a best-effort match for the cited passage.
          </p>
        )}
      </div>
    </div>
  );
}
