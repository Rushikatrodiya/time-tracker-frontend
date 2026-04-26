import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "../../utils/teamHelpers";

export default function TeamAvatar({ name, className = "" }) {
  const avatarColor = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <Avatar className={`w-8 h-8 ${className}`}>
      <AvatarFallback className={`${avatarColor} text-white text-sm font-semibold`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
