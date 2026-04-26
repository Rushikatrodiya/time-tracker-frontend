import TeamMemberRow from "./TeamMemberRow";

export default function TeamOverviewTable({ teamMembers, isLoading }) {
  if (isLoading) {
    return <TeamOverviewSkeleton />;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-[13px] font-semibold text-slate-900">
          Team overview — today
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              {["MEMBER", "STATUS", "CURRENT TASK", "HOURS TODAY", "PROGRESS"].map(
                (label) => (
                  <th
                    key={label}
                    className="text-left p-4 text-[13px] font-semibold text-slate-900"
                  >
                    {label}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {teamMembers?.map((member) => (
              <TeamMemberRow key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamOverviewSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="p-4 border-b border-slate-200">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
      </div>
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="h-2 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
