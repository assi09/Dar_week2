import { Send } from "lucide-react";

export default function InputBar() {
  return (
    <footer className="px-6 py-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
        <button className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors flex-shrink-0">
          <Send size={14} />
        </button>
      </div>
    </footer>
  );
}
