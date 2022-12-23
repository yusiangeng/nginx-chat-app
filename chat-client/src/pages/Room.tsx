import { Box, Button, Heading, HStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { sendMessage } from "../utils/socket";
import { ServerMessage } from "../utils/types";

function Room(props: {
  messages: ServerMessage[];
  currentlyJoinedRoom: string;
  displayName: string;
  leaveRoom: () => void;
}) {
  const { messages, currentlyJoinedRoom, displayName, leaveRoom } = props;
  const [typedMessage, setTypedMessage] = useState("");

  return (
    <>
      <HStack>
        <Heading size="md">Connected to Room {currentlyJoinedRoom}</Heading>
        <Button
          size="sm"
          onClick={() => navigator.clipboard.writeText(currentlyJoinedRoom)}
        >
          Copy Room ID
        </Button>
      </HStack>
      <Box w="100%" h="100px" flexGrow="1" overflowY="auto">
        {messages.map((msg, idx) => (
          <MessageView
            key={idx}
            message={msg}
            showName={idx == 0 || messages[idx - 1].fromName != msg.fromName}
          />
        ))}
      </Box>
      <Input
        placeholder={`Your Display Name: ${displayName}`}
        value={typedMessage}
        onChange={(e) => setTypedMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(
              {
                fromName: displayName,
                content: typedMessage,
              },
              leaveRoom
            );
            setTypedMessage("");
          }
        }}
      ></Input>
    </>
  );
}

export default Room;

function MessageView(props: { message: ServerMessage; showName: boolean }) {
  const { message, showName } = props;
  return (
    <Box alignItems="flex-start" my="2">
      {showName && (
        <Heading size="sm" mt="2">
          {message.fromName}
        </Heading>
      )}
      <Text>{message.content}</Text>
    </Box>
  );
}
