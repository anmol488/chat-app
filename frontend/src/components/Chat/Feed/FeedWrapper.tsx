import { Session } from "next-auth";

interface FeedWrapperProps {
  session: Session;
}

function FeedWrapper({ session }: FeedWrapperProps) {
  return <div>FeedWrapper</div>;
}

export default FeedWrapper;
