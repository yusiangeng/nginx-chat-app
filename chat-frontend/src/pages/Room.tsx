import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ServerMessage } from "../utils/types";

function Room(props: {
  messages: ServerMessage[];
  currentlyJoinedRoom: string;
}) {
  const { messages, currentlyJoinedRoom } = props;
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
        value={typedMessage}
        onChange={(e) => setTypedMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log(typedMessage);
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
    <Box alignItems="flex-start">
      {showName && (
        <Heading size="sm" mt="2">
          {message.fromName}
        </Heading>
      )}
      <Text>{message.content}</Text>
    </Box>
  );
}
