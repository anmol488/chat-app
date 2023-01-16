import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import UserOperations from "@/graphql/operations/user";
import { useLazyQuery } from "@apollo/client";
import { SearchedUser, SearchUsersData, SearchUsersInput } from "@/utils/types";
import UserSearchList from "./UserSearchList";
import ParticipantList from "./ParticipantList";
import { toast } from "react-hot-toast";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ConversationModal({ isOpen, onClose }: ModalProps) {
  const [username, setUsername] = useState("");
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const onSearchUsernames = (event: React.FormEvent) => {
    event.preventDefault();

    searchUsers({ variables: { username } });
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername("");
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  const onCreateConversation = async () => {
    try {
    } catch (error: any) {
      console.log("error", error);
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="2d2d2d" p={4}>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearchUsernames}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button type="submit" disabled={!username} isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data?.searchUsers}
                addParticipant={addParticipant}
              />
            )}
            {participants.length !== 0 && (
              <>
                <ParticipantList
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  _hover={{ bg: "brand.200" }}
                  width="100%"
                  mt={6}
                  onClick={onCreateConversation}
                >
                  Create conversation
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ConversationModal;
