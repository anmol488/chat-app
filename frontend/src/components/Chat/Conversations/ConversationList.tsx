import { Box, Button, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/ConversationModal";

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string, hasSeenLatest: boolean) => void;
}

function ConversationList({
  session,
  conversations,
  onViewConversation,
}: ConversationListProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

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
      {sortedConversations.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );

        if (participant === undefined) {
          throw new TypeError("Participant is undefined");
        }

        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() =>
              onViewConversation(conversation.id, participant?.hasSeenLatest)
            }
            hasSeenLatest={participant.hasSeenLatest}
            isSelected={conversation.id === router.query.conversationId}
          />
        );
      })}
    </Box>
  );
}

export default ConversationList;
