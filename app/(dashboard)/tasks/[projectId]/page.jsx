"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Navbar from "../../../../components/dashboard/Navbar";
import StatCard from "../../../../components/dashboard/StateCard";
import { DurationDisplay } from "../../../../components/tasks/DurationDisplay";
import EditTimeLogModal from "../../../../components/tasks/EditTimeLogModal";
import TaskRow from "../../../../components/tasks/TaskRow";
import { useTasks } from "../../../../hooks/useTasks";
import { useTaskTimers } from "../../../../hooks/useTaskTimers";
import { useTimeLogActions } from "../../../../hooks/useTimeLogActions";
import { useTimelogs } from "../../../../hooks/useTimelogs";
import { useTimerMutations } from "../../../../hooks/useTimerMutations";
import { useUpdateTask } from "../../../../hooks/useUpdateTask";
import { useCreateEntity } from "../../../../hooks/useCreateEntity";
import api from "../../../../lib/api";
import { useAuthStore } from "../../../../store/authStore";

export default function TasksPage() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;
  const { projectId } = useParams();
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { tasks: tasksData, isLoading, isError, error } = useTasks(projectId);

  const {
    activeTimer,
    hasActiveTimer,
    isTimerActive,
    durations,
    refetchDurations,
  } = useTaskTimers();

  const deleteMutation = useCreateEntity(
    (taskId) => api.delete(`/tasks/${taskId}`),
    [["tasks"], ["team", "overview"], ["timelogs"]],
  );

  const handleDeleteTask = (task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = () => {
    if (!deletingTask) return;
    deleteMutation.mutate(deletingTask.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDeletingTask(null);
      },
    });
  };

  const {
    expandedRows,
    toggleRow,
    getSubTasksForTask,
    invalidateTaskTimelogs,
    fetchTimelogsForTask,
    refreshTaskTimelogs,
  } = useTimelogs(tasksData);

  const { handleStartTimer, handleStopTimer, isPending } = useTimerMutations(
    refetchDurations,
    fetchTimelogsForTask,
  );

  const updateTask = useUpdateTask();

  const handleStatusUpdate = (taskId, newStatus) => {
    updateTask.mutate({ taskId, status: newStatus });
  };

  const handlePriorityUpdate = (taskId, newPriority) => {
    updateTask.mutate({ taskId, priority: newPriority });
  };

  const handleTitleUpdate = (taskId, newTitle) => {
    updateTask.mutate({ taskId, title: newTitle });
  };

  const {
    editModalOpen,
    setEditModalOpen,
    editingTimeLog,
    handleEditTimeLog,
    handleUpdateTimeLog,
    handleDeleteTimeLog,
    handleFieldChange,
  } = useTimeLogActions(
    invalidateTaskTimelogs,
    refetchDurations,
    refreshTaskTimelogs,
  );

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    return (
      <>
        <Navbar title="Tasks" />
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-[13px] text-slate-500 mb-6 max-w-md text-center">
            {error?.response?.data?.message || "You don't have permission to view this project's tasks or it doesn't exist."}
          </p>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </>
    );
  }

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
            {userRole === "ADMIN" || userRole === "MANAGER" ? (
              <Link href="/tasks/create">
                <Button size="sm" className="text-[12px] h-8">
                  <Plus className="w-3 h-3 mr-1" /> New Task
                </Button>
              </Link>
            ) : null}
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
          {tasksData?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-[13px] font-medium text-slate-900 mb-1">
                No tasks yet
              </p>
              {(userRole === "ADMIN" || userRole === "MANAGER") ? (
                <>
                  <p className="text-[12px] text-slate-400 mb-4">
                    Create your first task to get started tracking time
                  </p>
                  <Link href="/tasks/create">
                    <Button size="sm" className="text-[12px] h-8">
                      <Plus className="w-3 h-3 mr-1" />
                      Create Task
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="text-[12px] text-slate-400">
                  No tasks have been assigned to you yet.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    {[
                      "Title",
                      "Created By",
                      ...(userRole === "ADMIN" ? ["Assignee"] : []),
                      "Status",
                      "Priority",
                      "Date",
                      "Duration",
                      ...(userRole !== "ADMIN" ? ["Timer"] : []),
                      "",
                    ].map((label, i) => (
                      <th
                        key={i}
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
                      onStatusUpdate={handleStatusUpdate}
                      onPriorityUpdate={handlePriorityUpdate}
                      onTitleUpdate={handleTitleUpdate}
                      onDeleteTask={handleDeleteTask}
                      userRole={userRole}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <EditTimeLogModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editingTimeLog={editingTimeLog}
        onFieldChange={handleFieldChange}
        onUpdate={handleUpdateTimeLog}
      />

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
            <DialogDescription>
              {deletingTask?.title} and all its time logs and history will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTask}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
