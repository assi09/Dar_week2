import ChatMessage from "./ChatMessage";

const mockMessages = [
  { id: 1, role: "assistant", text: "Hi! Welcome to Dar Chat. How can I help you today?", time: "10:00 AM" },
  { id: 2, role: "user", text: "Hey! I just set up the project. The layout looks great so far.", time: "10:01 AM" },
  { id: 3, role: "assistant", text: "Awesome! You've got Vite + React + Tailwind all wired up. Next step is connecting the backend.", time: "10:01 AM" },
  { id: 4, role: "user", text: "Got it. Should I start with the API routes or the auth flow first?", time: "10:02 AM" },
  { id: 5, role: "assistant", text: "I'd recommend auth first — it'll make protecting your routes much easier once the API is in place.", time: "10:02 AM" },
];

export default function ChatViewport() {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
      {mockMessages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </main>
  );
}
