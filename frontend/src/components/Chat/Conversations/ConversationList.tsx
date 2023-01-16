import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import ConversationModal from "./Modal/ConversationModal";

interface ConversationListProps {
  session: Session;
}

function ConversationList({ session }: ConversationListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <Box width="100%">
      <Button
        py={2}
        px={4}
        mb={4}
        borderRadius={4}
        rounded="lg"
        onClick={onOpen}
        width="100%"
      >
        <Text textAlign="center" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Button>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session} />
    </Box>
  );
}

export default ConversationList;
