import { SearchedUser } from "../../../../utils/types";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { Flex, Stack, Text } from "@chakra-ui/react";

interface ParticipantListProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

function ParticipantList({
  participants,
  removeParticipant,
}: ParticipantListProps) {
  return (
    <Flex mt={6} gap="10px" flexWrap="wrap">
      {participants.map((participant) => (
        <Stack
          key={participant.id}
          direction="row"
          align="center"
          bg="whiteAlpha.200"
          borderRadius={4}
          p={2}
        >
          <Text>{participant.username}</Text>
          <SmallCloseIcon
            cursor="pointer"
            onClick={() => removeParticipant(participant.id)}
          />
        </Stack>
      ))}
    </Flex>
  );
}

export default ParticipantList;
