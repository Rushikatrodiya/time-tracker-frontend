"use client";
import Navbar from "../../../components/dashboard/Navbar";
import TeamSummaryCards from "../../../components/team/TeamSummaryCards";
import TeamOverviewTable from "../../../components/team/TeamOverviewTable";
import TeamSummarySkeleton from "../../../components/team/TeamSummarySkeleton";
import { useTeamSummary, useTeamOverview } from "../../../hooks/useTeamData";

export default function MyTeamPage() {
  const { data: teamSummary, isLoading: summaryLoading } = useTeamSummary();
  const { data: teamMembers, isLoading: membersLoading } = useTeamOverview();

  return (
    <>
      <Navbar title="My Team" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-[18px] font-semibold text-slate-900">
            My Team
          </h2>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Track your team&apos;s time and tasks
          </p>
        </div>

        {summaryLoading ? (
          <TeamSummarySkeleton />
        ) : (
          <TeamSummaryCards teamSummary={teamSummary} />
        )}

        <TeamOverviewTable 
          teamMembers={teamMembers} 
          isLoading={membersLoading} 
        />
      </div>
    </>
  );
}
