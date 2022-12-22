import {
  Button,
  Divider,
  FormLabel,
  HStack,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import uuid from "react-uuid";

function JoinRoom(props: {
  joinRoom(roomId: string): void;
  displayName: string;
  setDisplayName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { joinRoom, displayName, setDisplayName } = props;

  const [typedRoomId, setTypedRoomId] = useState("");

  return (
    <>
      <Input
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        maxW="64"
      />
      <Divider />
      <FormLabel textAlign="center">Join a Room</FormLabel>
      <HStack>
        <Input
          placeholder="Room ID"
          value={typedRoomId}
          onChange={(e) => setTypedRoomId(e.target.value)}
        />
        <Tooltip label="Please enter a Display Name" isDisabled={!!displayName}>
          <Button
            colorScheme="blue"
            onClick={() => {
              joinRoom(typedRoomId.replace(/\s/g, "").toLowerCase());
            }}
            disabled={!displayName}
          >
            Join
          </Button>
        </Tooltip>
      </HStack>
      <FormLabel>Or</FormLabel>
      <Tooltip label="Please enter a Display Name" isDisabled={!!displayName}>
        <Button
          onClick={() => {
            joinRoom(uuid().slice(0, 8));
          }}
          colorScheme="blue"
          disabled={!displayName}
        >
          Create a New Room
        </Button>
      </Tooltip>
    </>
  );
}

export default JoinRoom;
