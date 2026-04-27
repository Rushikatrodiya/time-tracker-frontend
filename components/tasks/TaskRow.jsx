import { DatePicker } from "@/components/ui/date-picker";
import { ChevronDown, ChevronRight, Edit } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "../../utils/formatTime";
import {
  getPriorityVariant,
  getStatusVariant,
  taskPriorityLabel,
} from "../../utils/taskHelpers";
import BadgeDropdown from "./BadgeDropdown";
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
  onStatusUpdate,
  onPriorityUpdate,
  onTitleUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef(null);

  const isActive = isTimerActive(task.id);
  const isOtherActive = hasActiveTimer && !isActive;
  const duration = durations[String(task.id)] || 0;
  const taskDate = task.created_at || task.createdAt || task.date || new Date();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditTitle(task.title);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editTitle.trim() !== task.title) {
        onTitleUpdate(task.id, editTitle.trim());
      }
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleBlur = () => {
    if (editTitle.trim() !== task.title) {
      onTitleUpdate(task.id, editTitle.trim());
    }
    setIsEditing(false);
  };
  return (
    <>
      <tr className="border-b border-slate-100 hover:bg-slate-50">
        <td className="p-4">
          <div className="flex items-center gap-2 -mx-4 px-4 py-2">
            {isExpanded ? (
              <ChevronDown
                className="w-4 h-4 text-slate-400 cursor-pointer hover:bg-slate-50 rounded p-1"
                onClick={() => onToggle(task.id)}
              />
            ) : (
              <ChevronRight
                className="w-4 h-4 text-slate-400 cursor-pointer hover:bg-slate-50 rounded p-1"
                onClick={() => onToggle(task.id)}
              />
            )}
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="font-medium text-slate-900 bg-transparent border border-black outline-none focus:border-black focus:ring-0 rounded px-1"
                style={{ minWidth: "100px" }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{task.title}</span>
                <Edit
                  className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick();
                  }}
                />
              </div>
            )}
          </div>
        </td>

        <td>
          <BadgeDropdown
            value={task.status}
            onChange={(newStatus) => onStatusUpdate(task.id, newStatus)}
            disabled={false}
            size="sm"
            options={[
              { value: "TODO", label: "To Do" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "DONE", label: "Completed" },
            ]}
            getVariant={getStatusVariant}
            getLabel={(val) => {
              const statusOptions = [
                { value: "TODO", label: "To Do" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "DONE", label: "Completed" },
              ];
              return (
                statusOptions.find((opt) => opt.value === val)?.label || val
              );
            }}
          />
        </td>

        <td>
          <BadgeDropdown
            value={task.priority}
            onChange={(newPriority) =>
              onPriorityUpdate(task.id, Number(newPriority))
            }
            disabled={false}
            size="sm"
            options={[
              { value: 1, label: "High" },
              { value: 2, label: "Medium" },
              { value: 3, label: "Low" },
            ]}
            getVariant={getPriorityVariant}
            getLabel={taskPriorityLabel}
          />
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
