import { ServerMessage } from "./types";

let ws: WebSocket | null = null;

export function setSocket(
  roomId: string,
  setCurrentlyJoinedRoom: React.Dispatch<React.SetStateAction<string>>,
  setMessages: React.Dispatch<React.SetStateAction<ServerMessage[]>>
) {
  ws = new WebSocket(
    `ws://${import.meta.env.BACKEND_URL || "localhost:8081"}/${roomId}`
  );
  ws.onerror = (e) => {
    alert("Socket error");
    closeSocket();
  };
  ws.onmessage = (e) => {
    const newMessage = JSON.parse(e.data);
    if (newMessage.error) {
      alert(`Error: ${newMessage.error}`);
      setCurrentlyJoinedRoom("");
      closeSocket();
    } else if (newMessage.connection) {
      console.log(`connected to server ${newMessage.connection}`);
      setCurrentlyJoinedRoom(newMessage.roomId);
    } else {
      setMessages((messages) => [...messages, newMessage as ServerMessage]);
    }
  };
}

export function closeSocket() {
  if (!ws) return;
  ws.close();
  ws = null;
}

export function sendMessage(message: ServerMessage) {
  if (!ws) return;
  ws.send(JSON.stringify(message));
}