import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "@/graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/utils/types";
import { ConversationPopulated } from "../../../../../backend/src/utils/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "@/components/Common/SkeletonLoader";

interface ConversationsWrapperProps {
  session: Session;
}

function ConversationsWrapper({ session }: ConversationsWrapperProps) {
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );
  const router = useRouter();
  const {
    query: { conversationId },
  } = router;

  const onViewConversation = async (conversationId: string) => {
    router.push({ query: { conversationId } });
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
      flexDirection="column"
      gap={4}
      py={6}
      px={3}
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
    >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
}

export default ConversationsWrapper;
