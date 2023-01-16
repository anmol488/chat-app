import { useMutation } from "@apollo/client";
import { Center, Stack, Input, Button, Text, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import UserOperations from "@/graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariables } from "@/utils/types";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}

function Auth({ session, reloadSession }: AuthProps) {
  const [username, setUsername] = useState("");

  const fadeAnimation = {
    hidden: { opacity: 0, y: 0 },
    show: { opacity: 2, y: 0, transition: { type: "spring", duration: 1.5 } },
  };

  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onCreateUsername = async () => {
    try {
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        throw new Error(error);
      }

      toast.success("Successfully created username 😎");
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      animate="show"
      viewport={{ once: true }}
      variants={fadeAnimation}
    >
      <Center height="100vh">
        <Stack spacing={8} align="center">
          {session ? (
            <>
              <Text fontSize="3xl" fontWeight={500}>
                Welcome, {session.user.name} 🥳
              </Text>
              <Input
                fontWeight={500}
                placeholder="Create a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button
                disabled={!username}
                onClick={onCreateUsername}
                width="100%"
                bg="brand.100"
                _hover={{ bg: "brand.200" }}
                isLoading={loading}
              >
                Create
              </Button>
            </>
          ) : (
            <>
              <Image height="150px" src="/chat.png" />
              <Text width="60%" align="center" fontWeight={500}>
                Real-time chat website for students. Stay connected like never
                before! 🚀
              </Text>
              <Button
                onClick={() => signIn("google")}
                leftIcon={<Image height="20px" src="/googlelogo.png" />}
              >
                Continue with Google
              </Button>
            </>
          )}
        </Stack>
      </Center>
    </motion.div>
  );
}

export default Auth;
