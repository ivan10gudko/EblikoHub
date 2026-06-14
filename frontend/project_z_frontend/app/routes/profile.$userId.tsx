import { useOutletContext } from "react-router";
import { UserProfileCard } from "~/widgets/UserProfileCard";

export default function ProfileRoute() {
  const { userId: targetUserId } = useOutletContext<{ userId: string }>();

  return <UserProfileCard userId={targetUserId!} />;
}
