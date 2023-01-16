import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "@/graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/utils/types";

interface ConversationsWrapperProps {
  session: Session;
}

function ConversationsWrapper({ session }: ConversationsWrapperProps) {
  const {
    data: conversationsData,
    loading: conversationsLoading,
    error: conversationsError,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );

  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
      />
    </Box>
  );
}

export default ConversationsWrapper;
