import { Button, Divider, FormLabel, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import uuid from "react-uuid";

function JoinRoom(props: { joinRoom(roomId: string): void }) {
  const { joinRoom } = props;
  const [typedRoomId, setTypedRoomId] = useState("");

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          joinRoom(typedRoomId.replace(/\s/g, "").toLowerCase());
        }}
      >
        <FormLabel textAlign="center">Join a Room</FormLabel>
        <HStack>
          <Input
            placeholder="Room ID"
            value={typedRoomId}
            onChange={(e) => setTypedRoomId(e.target.value)}
          />
          <Button type="submit" colorScheme="blue">
            Join
          </Button>
        </HStack>
      </form>
      <Divider mt="4" />
      <FormLabel>Or</FormLabel>
      <Button
        onClick={() => {
          joinRoom(uuid().slice(0, 8));
        }}
        colorScheme="blue"
      >
        Create a New Room
      </Button>
    </>
  );
}

export default JoinRoom;
