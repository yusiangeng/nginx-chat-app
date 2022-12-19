import { WebSocket, WebSocketServer } from "ws";
import { createClient } from "redis";

const PORT = Number(process.env.PORT) || 8081;

const wss = new WebSocketServer({ port: PORT });

const subscriber = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});
const publisher = createClient({
  url: `redis://${process.env.REDIS_HOST}:6379`,
});

(async () => {
  await subscriber.connect();
  await publisher.connect();
})();

const CHANNEL = "livechat";

subscriber.subscribe(CHANNEL, (message) => {
  console.log(`app ${PORT} received message from redis: ${message}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

wss.on("connection", (ws) => {
  console.log("connection event. clients:", wss.clients.size);
  ws.send(`connected to app ${PORT}`);

  ws.on("message", (data) => {
    console.log(`app ${PORT} received message from client: ${data}`);
    publisher.publish(CHANNEL, data.toString());
  });
});
