import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime } from "../../utils/formatTime";
import { Clock, ArrowRight, Timer, MoreVertical, Edit } from "lucide-react";

export default function TimeLogRow({ timelog, taskId, onEdit, onDelete, userRole, isArchived }) {
  if (timelog.isEmpty) {
    return (
      <tr className="bg-slate-50 border-b border-slate-100">
        <td colSpan={10} className="p-4 pl-12 text-sm text-slate-400">
          No time sessions found
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-slate-50/50 border-b border-slate-100">
      <td colSpan={10} className="p-4 pl-12">
        <div className="flex items-center gap-6 justify-around">
          <span className="text-sm font-semibold text-slate-900 min-w-[150px]">
            {timelog.title}
          </span>

          <div className="flex items-center gap-12">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {timelog.startTime}
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {timelog.endTime}
            </div>

          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
            <Timer className="w-3.5 h-3.5" />
            {formatTime(timelog.duration)}
          </div>

          {userRole !== 'ADMIN' && (
            <div className="flex items-center justify-end pr-4" title={isArchived ? "Cannot edit time logs in an archived project" : ""}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isArchived}>
                  <button className="flex items-center justify-center w-8 h-8 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEdit(timelog, taskId, timelog.title)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(timelog, taskId)} className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
