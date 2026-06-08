export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          D
        </div>
        <span className="text-lg font-semibold text-gray-800">Dar Chat</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Week 2</span>
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
      </div>
    </header>
  );
}
