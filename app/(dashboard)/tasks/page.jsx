"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Navbar from "../../../components/dashboard/Navbar";
import StatCard from "../../../components/dashboard/StateCard";
import { DurationDisplay } from "../../../components/tasks/DurationDisplay";
import EditTimeLogModal from "../../../components/tasks/EditTimeLogModal";
import TaskRow from "../../../components/tasks/TaskRow";
import useQueryHook from "../../../hooks/useQuery";
import { useTaskTimers } from "../../../hooks/useTaskTimers";
import { useTimeLogActions } from "../../../hooks/useTimeLogActions";
import { useTimelogs } from "../../../hooks/useTimelogs";
import { useTimerMutations } from "../../../hooks/useTimerMutations";
import api from "../../../lib/api";

export default function TasksPage() {
  const { data: tasksData, isLoading } = useQueryHook({
    key: ["tasks"],
    fn: () => api.get("/tasks"),
    select: (res) => res.data.data.tasks,
  });

  const {
    activeTimer,
    hasActiveTimer,
    isTimerActive,
    durations,
    refetchDurations,
  } = useTaskTimers();

  const {
    expandedRows,
    toggleRow,
    getSubTasksForTask,
    invalidateTaskTimelogs,
    fetchTimelogsForTask,
  } = useTimelogs(tasksData);

  const { handleStartTimer, handleStopTimer, isPending } = useTimerMutations(
    refetchDurations,
    fetchTimelogsForTask,
  );

  const {
    editModalOpen,
    setEditModalOpen,
    editingTimeLog,
    handleEditTimeLog,
    handleUpdateTimeLog,
    handleDeleteTimeLog,
    handleFieldChange,
  } = useTimeLogActions(invalidateTaskTimelogs, refetchDurations);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Navbar title="Tasks" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900">
              Tasks Overview
            </h2>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Manage and track all your tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            {activeTimer && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-[12px] font-medium text-blue-700">
                  Active Timer
                </span>
                <DurationDisplay
                  taskId={activeTimer.taskId}
                  startTime={activeTimer.startTime}
                  taskDurations={durations}
                  isActive={true}
                />
              </div>
            )}
            <Link href="/tasks/create">
              <Button size="sm" className="text-[12px] h-8">
                <Plus className="w-3 h-3 mr-1" /> New Task
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            label="Total Tasks"
            value={tasksData?.length || 0}
            sub={`${tasksData?.length || 0} tasks`}
          />
          <StatCard
            label="In Progress"
            value={
              tasksData?.filter((t) => t.status === "IN_PROGRESS")?.length || 0
            }
            sub="Currently working"
          />
          <StatCard
            label="Completed"
            value={tasksData?.filter((t) => t.status === "DONE")?.length || 0}
            sub="Finished tasks"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-[13px] font-semibold text-slate-900">
              All Tasks
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  {[
                    "Title",
                    "Status",
                    "Priority",
                    "Date",
                    "Duration",
                    "Timer",
                  ].map((label) => (
                    <th
                      key={label}
                      className="text-left p-4 text-[13px] font-semibold text-slate-900"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasksData?.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isExpanded={expandedRows.has(task.id)}
                    subTasks={getSubTasksForTask(task.id)}
                    durations={durations}
                    isTimerActive={isTimerActive}
                    hasActiveTimer={hasActiveTimer}
                    isPending={isPending}
                    onToggle={toggleRow}
                    onStartTimer={handleStartTimer}
                    onStopTimer={handleStopTimer}
                    onEditTimeLog={handleEditTimeLog}
                    onDeleteTimeLog={handleDeleteTimeLog}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EditTimeLogModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editingTimeLog={editingTimeLog}
        onFieldChange={handleFieldChange}
        onUpdate={handleUpdateTimeLog}
      />
    </>
  );
}
