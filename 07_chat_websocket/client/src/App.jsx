import { useEffect, useRef, useState } from "react";

export default function App() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const [value, setValue] = useState("");
  const [user, setUser] = useState(localStorage.getItem("chat_user") || "");
  const [nicknameInput, setNicknameInput] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket("ws://10.3.225.43:8080");
    setWs(socket);

    socket.onopen = () => console.log("Connected");

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        setMessages((prev) => [...prev, { user: "system", text: event.data }]);
      }
    };

    socket.onclose = () => console.log("Disconnected");

    return () => socket.close();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!value.trim() || !ws) return;

    const msg = { user, text: value };
    ws.send(JSON.stringify(msg));

    setValue("");
  };

  const saveUsername = () => {
    if (!nicknameInput.trim()) return;
    localStorage.setItem("chat_user", nicknameInput.trim());
    setUser(nicknameInput.trim());
  };

  // 👤 Экран ввода ника
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-center">
            Введите ваш ник 👤
          </h1>

          <input
            className="p-2 rounded-md bg-gray-700 outline-none"
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveUsername()}
            placeholder="Например: Vitok"
          />

          <button
            onClick={saveUsername}
            className="bg-blue-500 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Войти в чат
          </button>
        </div>
      </div>
    );
  }

  // 💬 Основной чат
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg p-4 flex flex-col h-[500px]">
        {/* Header */}
        <div className="text-sm mb-2 text-gray-400 flex justify-between">
          <span>Вы: {user}</span>
          <button
            className="text-red-400"
            onClick={() => {
              localStorage.removeItem("chat_user");
              setUser("");
            }}
          >
            сменить ник
          </button>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md max-w-[70%] 
              ${m.user === user ? "bg-blue-500 ml-auto" : "bg-gray-700"}`}
            >
              <div className="text-xs opacity-70">{m.user}</div>
              <div>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Ввод сообщения */}
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
