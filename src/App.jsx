import Header from "./components/Header";
import ChatViewport from "./components/ChatViewport";
import InputBar from "./components/InputBar";

export default function App() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      <ChatViewport />
      <InputBar />
    </div>
  );
}
