import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Moon, Sun, ChevronDown, ChevronUp, Loader2, Activity } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const METRIC_COLORS = {
  Faithfulness: '#6366f1',
  'Answer Relevancy': '#22c55e',
  'Contextual Relevancy': '#f59e0b',
};

const BACKEND = 'http://localhost:8000';
const THEME_KEY = 'dar-theme';

const REASON_LABELS = {
  incorrect: 'Incorrect',
  incomplete: 'Incomplete',
  not_relevant: 'Not relevant',
  unclear: 'Unclear',
  other: 'Other',
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function FeedbackCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const isPositive = entry.score === 1;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
            isPositive
              ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
          }`}
        >
          {isPositive ? <ThumbsUp size={14} /> : <ThumbsDown size={14} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {!isPositive && entry.reason && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800">
                {REASON_LABELS[entry.reason] || entry.reason}
              </span>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(entry.created_at)}</span>
          </div>

          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{entry.question}</p>

          {entry.comment && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">"{entry.comment}"</p>
          )}

          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-2 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Hide answer' : 'Show answer'}
          </button>

          {expanded && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              {entry.answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [evalMetrics, setEvalMetrics] = useState([]);
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  useEffect(() => {
    fetch(`${BACKEND}/api/feedback`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setFeedback([...data.feedback].reverse()))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Live RAG quality metrics — poll so the chart updates as new "rag" questions come in.
  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`${BACKEND}/api/eval-metrics`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setEvalMetrics(data.metrics))
        .catch(() => {});
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = feedback.filter(f => {
    if (filter === 'up') return f.score === 1;
    if (filter === 'down') return f.score === 0;
    return true;
  });

  const upCount = feedback.filter(f => f.score === 1).length;
  const downCount = feedback.filter(f => f.score === 0).length;

  const chartData = useMemo(() => {
    const byDate = {};
    for (const f of feedback) {
      const date = (f.created_at || '').slice(0, 10);
      if (!byDate[date]) byDate[date] = { date, positive: 0, negative: 0 };
      if (f.score === 1) byDate[date].positive += 1;
      else byDate[date].negative += 1;
    }
    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [feedback]);

  // Group raw per-metric rows into one point per "rag" question, in arrival order.
  const evalChartData = useMemo(() => {
    const byRun = new Map();
    for (const m of evalMetrics) {
      if (!byRun.has(m.run_id)) {
        byRun.set(m.run_id, { run_id: m.run_id, question: m.question, created_at: m.created_at });
      }
      byRun.get(m.run_id)[m.metric] = Math.round(m.score * 100);
    }
    return [...byRun.values()].map((point, i) => ({ ...point, index: i + 1 }));
  }, [evalMetrics]);

  const evalAverages = useMemo(() => {
    const sums = {};
    const counts = {};
    for (const m of evalMetrics) {
      sums[m.metric] = (sums[m.metric] || 0) + m.score;
      counts[m.metric] = (counts[m.metric] || 0) + 1;
    }
    return Object.keys(sums).map(metric => ({
      metric,
      avg: Math.round((sums[metric] / counts[metric]) * 100),
    }));
  }, [evalMetrics]);

  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to chat
          </a>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 ml-2">Feedback</span>
        </div>
        <button
          onClick={toggleTheme}
          title="Toggle dark mode"
          className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {evalChartData.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-indigo-500" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Live RAG quality metrics</h2>
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 ml-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                live
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              No-ground-truth DeepEval scores computed automatically for every CIS Controls question.
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              {evalAverages.map(({ metric, avg }) => (
                <div
                  key={metric}
                  className="flex-1 min-w-[120px] rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2"
                >
                  <div className="text-xs text-gray-400 dark:text-gray-500">{metric}</div>
                  <div className="text-lg font-semibold" style={{ color: METRIC_COLORS[metric] }}>
                    {avg}%
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={evalChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="index" stroke={axisColor} fontSize={12} label={{ value: 'RAG question #', position: 'insideBottom', offset: -2, fontSize: 11, fill: axisColor }} />
                <YAxis domain={[0, 100]} stroke={axisColor} fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: axisColor }}
                  formatter={(value) => `${value}%`}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.question || ''}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {Object.keys(METRIC_COLORS).map(metric => (
                  <Line
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={METRIC_COLORS[metric]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {!loading && !error && chartData.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Feedback by date</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="date" stroke={axisColor} fontSize={12} />
                <YAxis allowDecimals={false} stroke={axisColor} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: axisColor }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="positive" name="Positive" stackId="feedback" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="negative" name="Negative" stackId="feedback" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          {[
            { key: 'all', label: `All (${feedback.length})` },
            { key: 'up', label: `Positive (${upCount})` },
            { key: 'down', label: `Negative (${downCount})` },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === opt.key
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        {error && !loading && (
          <p className="text-sm text-red-400 text-center py-16">
            Could not reach the backend. Make sure the API server is running on port 8000.
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-16">No feedback yet.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map(entry => (
              <FeedbackCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
