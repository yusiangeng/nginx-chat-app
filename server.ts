import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", function connection(ws) {
  console.log("connection event. clients:", wss.clients.size);

  ws.on("message", function message(data, isBinary) {
    console.log("received: %s", data);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
