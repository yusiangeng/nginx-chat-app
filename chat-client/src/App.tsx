import {
  Button,
  Container,
  HStack,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";
import { closeSocket, setSocket } from "./utils/socket";
import { ServerMessage } from "./utils/types";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [currentlyJoinedRoom, setCurrentlyJoinedRoom] = useState("");
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [displayName, setDisplayName] = useState("");

  function joinRoom(roomId: string) {
    setSocket(roomId, setCurrentlyJoinedRoom, setMessages);
  }

  return (
    <Container minW="md" maxW="2xl">
      <VStack minH="100vh" maxH="100vh" py="4">
        <HStack minW="100%" justifyContent="space-between" mb="1">
          <Button onClick={toggleColorMode}>
            Use {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
          {currentlyJoinedRoom && (
            <Button
              onClick={() => {
                closeSocket();
                setCurrentlyJoinedRoom("");
                setMessages([]);
              }}
              colorScheme="red"
            >
              Leave Room
            </Button>
          )}
        </HStack>

        <VStack w="100%" border="1px" borderRadius="md" p="4" flexGrow="1">
          {!currentlyJoinedRoom ? (
            <JoinRoom
              joinRoom={joinRoom}
              displayName={displayName}
              setDisplayName={setDisplayName}
            />
          ) : (
            <Room
              currentlyJoinedRoom={currentlyJoinedRoom}
              messages={messages}
              displayName={displayName}
            />
          )}
        </VStack>
      </VStack>
    </Container>
  );
}

export default App;
