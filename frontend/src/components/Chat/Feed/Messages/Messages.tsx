import { Flex, Stack } from "@chakra-ui/react";
import MessageOperations from "@/graphql/operations/message";
import { useQuery } from "@apollo/client";
import { MessagesData, MessagesVariables } from "@/utils/types";
import { toast } from "react-hot-toast";
import SkeletonLoader from "@/components/Common/SkeletonLoader";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

function Messages({ userId, conversationId }: MessagesProps) {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: { conversationId },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  if (error) {
    return null;
  }

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            // <MessageItem />
            <div>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
}

export default Messages;
