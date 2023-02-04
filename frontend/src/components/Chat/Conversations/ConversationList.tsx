import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/ConversationModal";
import ConversationOperations from "@/graphql/operations/conversation";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import Link from "next/link";

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
  const [deleteConversation] = useMutation<{
    deleteConversation: boolean;
    conversationId: string;
  }>(ConversationOperations.Mutations.deleteConversation);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: {
            conversationId,
          },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation...",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error) {
      console.log("onDeleteConversation error", error);
    }
  };

  return (
    <Box position="relative" height="100%" overflow="hidden">
      <Button
        py={2}
        px={4}
        mb={4}
        borderRadius={4}
        rounded="lg"
        onClick={onOpen}
        width="100%"
      >
        Find or start a conversation
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
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}
      <Link href="forum">
        <Button
          position="absolute"
          bottom={54}
          left={0}
          width="100%"
          px={4}
          rounded="lg"
          py={2}
          zIndex={1}
        >
          Visit ReplyQL forum
        </Button>
      </Link>
      <Button
        position="absolute"
        bottom={0}
        left={0}
        width="100%"
        px={4}
        rounded="lg"
        py={2}
        zIndex={1}
        bg="brand.100"
        _hover={{ bg: "brand.200" }}
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </Box>
  );
}

export default ConversationList;
