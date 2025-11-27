// server/server.js
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080,
  host: "0.0.0.0",
});

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (data) => {
    // Когда клиент отправляет сообщение — рассылаем всем
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        console.log("Message: ", data.toString());
        client.send(data.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
