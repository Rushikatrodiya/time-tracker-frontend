import { Badge } from "@/components/ui/badge";
import TeamAvatar from "./TeamAvatar";
import ProgressBar from "./ProgressBar";
import { statusVariants, formatHoursMinutes } from "../../utils/teamHelpers";

export default function TeamMemberRow({ member }) {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <TeamAvatar name={member.name} />
          <div>
            <p className="font-medium text-slate-900">{member.name}</p>
            <p className="text-[11px] text-slate-400">{member.role}</p>
          </div>
        </div>
      </td>

      <td className="p-4">
        <Badge
          variant="outline"
          className={`text-[11px] ${statusVariants[member.status] || statusVariants.Offline}`}
        >
          {member.status}
        </Badge>
      </td>

      <td className="p-4">
        <span className="text-[13px] text-slate-600">
          {member.currentTask || "-"}
        </span>
      </td>

      <td className="p-4">
        <span className="font-mono text-[12px] text-slate-500">
          {formatHoursMinutes(member.workToday)}
        </span>
      </td>

      <td className="p-4">
        <div className="w-24">
          <ProgressBar progress={member.progress} />
        </div>
      </td>
    </tr>
  );
}
