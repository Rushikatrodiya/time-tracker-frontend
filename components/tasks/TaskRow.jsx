import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatTime } from "../../utils/formatTime";
import {
  getPriorityVariant,
  getStatusVariant,
  taskPriorityLabel,
} from "../../utils/taskHelpers";
import TimeLogRow from "./TimeLogRow";
import { TimerButton } from "./TimerButton";

export default function TaskRow({
  task,
  isExpanded,
  subTasks,
  durations,
  isTimerActive,
  hasActiveTimer,
  isPending,
  onToggle,
  onStartTimer,
  onStopTimer,
  onEditTimeLog,
  onDeleteTimeLog,
}) {
  const isActive = isTimerActive(task.id);
  const isOtherActive = hasActiveTimer && !isActive;
  const duration = durations[String(task.id)] || 0;
  const taskDate = task.created_at || task.createdAt || task.date || new Date();
  console.log(subTasks, "subtasks");
  return (
    <>
      <tr className="border-b border-slate-100 hover:bg-slate-50">
        <td className="p-4">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 -mx-4 px-4 py-2 rounded"
            onClick={() => onToggle(task.id)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
            <span className="font-medium text-slate-900">{task.title}</span>
          </div>
        </td>

        <td className="p-4">
          <Badge
            variant="outline"
            className={`text-[11px] ${getStatusVariant(task.status)}`}
          >
            {task.status}
          </Badge>
        </td>

        <td className="p-4">
          <Badge
            variant="outline"
            className={`text-[11px] ${getPriorityVariant(task.priority)}`}
          >
            {taskPriorityLabel(task.priority)}
          </Badge>
        </td>

        <td className="p-4">
          <DatePicker date={taskDate} disabled={false} />
        </td>

        <td className="p-4">
          <span className="font-mono text-[12px] text-slate-500">
            {formatTime(duration)}
          </span>
        </td>

        <td className="p-4">
          <TimerButton
            taskId={task.id}
            isActive={isActive}
            isPending={isPending}
            isOtherTimerActive={isOtherActive}
            onStart={onStartTimer}
            onStop={onStopTimer}
          />
        </td>
      </tr>

      {isExpanded &&
        subTasks?.map((timelog) => {
          return (
            <TimeLogRow
              key={timelog.id}
              timelog={timelog}
              taskId={task.id}
              onEdit={onEditTimeLog}
              onDelete={onDeleteTimeLog}
            />
          );
        })}
    </>
  );
}
