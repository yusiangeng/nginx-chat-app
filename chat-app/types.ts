import { WebSocket } from "ws";

export interface RoomSocket {
  roomId: string;
  socket: WebSocket;
}

export interface ClientMessage {
  fromName: string;
  content: string;
}

export interface PubSubMessage extends ClientMessage {
  roomId: string;
}
