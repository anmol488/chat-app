import { Stack, Text } from "@chakra-ui/react";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";

interface ConversationItemProps {
  conversation: ConversationPopulated;
}

function ConversationItem({ conversation }: ConversationItemProps) {
  return (
    <Stack p={4} _hover={{ bg: "whiteAlpha.200" }} borderRadius={4}>
      <Text>{conversation.id}</Text>
    </Stack>
  );
}

export default ConversationItem;
