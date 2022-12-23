import { ServerMessage } from "./types";

let ws: WebSocket | null = null;

export function setSocket(
  roomId: string,
  setCurrentlyJoinedRoom: React.Dispatch<React.SetStateAction<string>>,
  setMessages: React.Dispatch<React.SetStateAction<ServerMessage[]>>,
  leaveRoom: () => void
) {
  ws = new WebSocket(
    `${import.meta.env.VITE_BACKEND_URL || "ws://localhost:8081"}/${roomId}`
  );
  ws.onerror = (e) => {
    alert("Socket error");
    leaveRoom();
  };
  ws.onmessage = (e) => {
    const newMessage = JSON.parse(e.data);
    if (newMessage.error) {
      alert(`Error: ${newMessage.error}`);
      leaveRoom();
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

export function sendMessage(message: ServerMessage, leaveRoom: () => void) {
  if (!ws) return;
  if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
    alert("Connection lost");
    leaveRoom();
    return;
  }
  ws.send(JSON.stringify(message));
}
