import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";

export default function MemberRow({ member, onRemove, isRemoving }) {
  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-500 text-white">
              {member.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {member.user?.name}
            </p>
            <p className="text-xs text-slate-500">
              {member.user?.email} • Joined{" "}
              {new Date(member.joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {member.user?.role}
          </Badge>
          {member.user?.role !== "ADMIN" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={isRemoving}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <UserMinus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
