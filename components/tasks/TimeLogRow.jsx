import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime } from "../../utils/formatTime";

export default function TimeLogRow({ timelog, taskId, onEdit, onDelete }) {
  if (timelog.isEmpty) {
    return (
      <tr className="bg-blue-50 border-b border-blue-100">
        <td className="p-4 pl-12 text-sm text-slate-400" colSpan="6">
          No time sessions found
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-blue-50 border-b border-blue-100">
      <td className="p-4 pl-12" colSpan="6">
        <div className="flex items-center justify-around">
          <span className="text-sm text-slate-600 font-medium">
            {timelog.title}
          </span>
          <span className="text-xs text-slate-500">{timelog.startTime}</span>
          <span className="text-xs text-slate-500">{timelog.endTime}</span>
          <span className="font-mono text-xs text-slate-500">
            {formatTime(timelog.duration)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-400 hover:text-slate-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(timelog, taskId)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(timelog, taskId)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}
