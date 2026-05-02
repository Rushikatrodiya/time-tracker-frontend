import { Users } from "lucide-react";
import MemberRow from "./MemberRow";

export default function MemberList({
  members,
  isLoading,
  onRemove,
  isRemoving,
  compact = false,
}) {
  const MemberListSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-32"></div>
              <div className="h-3 bg-slate-200 rounded w-48"></div>
            </div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="p-12 text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        <Users className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-900 mb-1">
        No team members yet
      </p>
      <p className="text-xs text-slate-400 mb-4">
        Add members to start collaborating on this project
      </p>
    </div>
  );

  if (compact) {
    return isLoading ? (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-3 bg-slate-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    ) : members?.length > 0 ? (
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                {member.user?.name?.charAt(0) || "U"}
              </div>
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
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 border border-slate-200 rounded-md">
                {member.user?.role}
              </span>
              <button
                onClick={() => onRemove(member)}
                disabled={isRemoving}
                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-slate-500">
        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
        <p className="text-sm">No members yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-[13px] font-semibold text-slate-900">
          Current Members ({members?.length || 0})
        </h3>
      </div>

      {isLoading ? (
        <div className="p-6">
          <MemberListSkeleton />
        </div>
      ) : members?.length > 0 ? (
        <div className="divide-y divide-slate-200">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              onRemove={() => onRemove(member)}
              isRemoving={isRemoving}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
