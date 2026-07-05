import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "../../utils/formatTime";
import { getPriorityVariant, taskPriorityLabel } from "../../utils/taskHelpers";
import { getInitials } from "../../utils/avatarHelpers";
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
  onDeleteTask,
  userRole,
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
                <span className="font-medium text-slate-900">
                  {task.project?.projectKey && task.ticketNumber && (
                    <span>
                      {task.project.projectKey}-{task.ticketNumber}
                    </span>
                  )}
                  {(task.project?.projectKey || task.ticketNumber) && " "}
                  {task.title}
                </span>
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

        <td className="p-4 text-[13px] text-slate-700">
          {task.creator?.name ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-[10px] font-medium">
                {getInitials(task.creator.name)}
              </div>
              <span>{task.creator.name}</span>
            </div>
          ) : (
            <span className="text-slate-400 italic">-</span>
          )}
        </td>
        {userRole === "ADMIN" && (
          <>
            <td className="p-4 text-[13px] text-slate-700">
              {task.assignments?.[0]?.user?.name ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-medium">
                    {getInitials(task.assignments[0].user.name)}
                  </div>
                  <span>{task.assignments[0].user.name}</span>
                </div>
              ) : (
                <span className="text-slate-400 italic">Not assigned</span>
              )}
            </td>
          </>
        )}

        <td>
          <Select
            value={task.status}
            onValueChange={(newStatus) => onStatusUpdate(task.id, newStatus)}
          >
            <SelectTrigger className="w-32 text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Completed</SelectItem>
            </SelectContent>
          </Select>
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

        <td className="p-4 text-[13px] text-slate-700">
          {new Date(taskDate).toLocaleDateString()}
        </td>

        <td className="p-4">
          <span className="font-mono text-[12px] text-slate-500">
            {formatTime(duration)}
          </span>
        </td>

        {userRole !== "ADMIN" ? (
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
        ) : null}

        {userRole === "ADMIN" ? (
          <td className="p-4">
            <Trash2
              className="w-4 h-4 text-slate-400 cursor-pointer hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task);
              }}
            />
          </td>
        ) : (
          <td className="p-4"></td>
        )}
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
              userRole={userRole}
            />
          );
        })}
    </>
  );
}
