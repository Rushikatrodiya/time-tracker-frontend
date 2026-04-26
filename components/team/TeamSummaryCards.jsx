import StatCard from "../dashboard/StateCard";
import { formatHoursMinutes } from "../../utils/teamHelpers";

export default function TeamSummaryCards({ teamSummary }) {
  const cards = [
    {
      label: "TEAM MEMBERS",
      value: teamSummary?.teamMembersCount || 0,
      sub: `${teamSummary?.teamMembersCount || 0} members`,
    },
    {
      label: "TEAM HOURS TODAY",
      value: formatHoursMinutes(teamSummary?.teamWorksToday),
      sub: "Combined",
    },
    {
      label: "ACTIVE RIGHT NOW",
      value: teamSummary?.activeNowCount || 0,
      sub: "Tracking time",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}
