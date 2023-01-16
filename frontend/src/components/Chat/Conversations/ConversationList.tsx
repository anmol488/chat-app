import { Session } from "next-auth";

interface ConversationListProps {
  session: Session;
}

function ConversationList({ session }: ConversationListProps) {
  return <div>ConversationList</div>;
}

export default ConversationList;
