import { WebSocket, WebSocketServer } from "ws";
import { createClient } from "redis";
import { hostname } from "os";
import { ClientMessage, PubSubMessage, RoomSocket } from "./types";

const PORT = Number(process.env.PORT) || 8081;

const wss = new WebSocketServer({ port: PORT });

const REDIS_HOST = process.env.REDIS_HOST || "localhost";

const subscriber = createClient({
  url: `redis://${REDIS_HOST}:6379`,
});
const publisher = createClient({
  url: `redis://${REDIS_HOST}:6379`,
});

(async () => {
  await subscriber.connect();
  await publisher.connect();
})();

const roomSockets = new Set<RoomSocket>();

const CHANNEL = "livechat";

subscriber.subscribe(CHANNEL, (message) => {
  const { roomId } = JSON.parse(message) as PubSubMessage;
  roomSockets.forEach((client) => {
    if (
      client.roomId == roomId &&
      client.socket.readyState === WebSocket.OPEN
    ) {
      client.socket.send(message);
    }
  });
});

wss.on("connection", (ws, req) => {
  const roomId = req.url?.slice(1);
  if (!roomId || roomId.length == 0) {
    ws.send("Room ID required");
    ws.close();
    return;
  }
  const roomSocket: RoomSocket = {
    roomId,
    socket: ws,
  };
  roomSockets.add(roomSocket);
  console.log(
    `CONNECTION OPENED: Client connected to room ${roomId}. Clients: ${wss.clients.size}/${roomSockets.size}`
  );
  ws.send(`connected to ${hostname()}`);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString()) as ClientMessage;
    const publishMessage: PubSubMessage = {
      fromName: message.fromName,
      content: message.content,
      roomId,
    };
    publisher.publish(CHANNEL, JSON.stringify(publishMessage));
  });

  ws.on("close", (code, reason) => {
    roomSockets.delete(roomSocket);
    console.log(
      `CONNECTION CLOSED: Client disconnected from room ${roomId}. Clients: ${wss.clients.size}/${roomSockets.size}`
    );
  });
});
