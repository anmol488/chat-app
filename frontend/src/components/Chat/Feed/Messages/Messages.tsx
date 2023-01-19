import { Flex, SkeletonCircle, Stack } from "@chakra-ui/react";
import MessageOperations from "@/graphql/operations/message";
import { useQuery } from "@apollo/client";
import {
  MessagesData,
  MessageSubscriptionData,
  MessagesVariables,
} from "@/utils/types";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import MessageItem from "./MessageItem";

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

  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

    return () => unsubscribe();
  }, [conversationId]);

  if (error) {
    return null;
  }

  return (
    <Flex direction="column" justify="flex-end" overflow="hidden">
      {data?.messages && (
        <Flex direction="column-reverse" overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              sentByMe={message.sender.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
}

export default Messages;
