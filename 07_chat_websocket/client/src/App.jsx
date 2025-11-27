import { useEffect, useRef, useState } from "react";

export default function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.0.105:8080");
    setWs(socket);

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    console.log("sended");
    if (!value.trim()) return;
    ws.send(value);
    setValue("");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      {/* Chat container */}
      <div className="w-full max-w-lg bg-gray-800 rounded-lg p-4 flex flex-col h-[500px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
          {messages.map((m, i) => (
            <div key={i} className="bg-gray-700 p-2 rounded-md">
              {m}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded-md bg-gray-700 outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
