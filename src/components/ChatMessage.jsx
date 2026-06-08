export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">
          D
        </div>
      )}
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        <p>{message.text}</p>
        <span
          className={`text-xs mt-1 block ${
            isUser ? "text-indigo-200 text-right" : "text-gray-400"
          }`}
        >
          {message.time}
        </span>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold ml-3 flex-shrink-0 mt-1">
          U
        </div>
      )}
    </div>
  );
}
