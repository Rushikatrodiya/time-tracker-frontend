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
import { Search, X, Plus, Info } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../../../../components/dashboard/Navbar";
import StatCard from "../../../../components/dashboard/StateCard";
import { DurationDisplay } from "../../../../components/tasks/DurationDisplay";
import EditTimeLogModal from "../../../../components/tasks/EditTimeLogModal";
import TaskRow from "../../../../components/tasks/TaskRow";
import { useTasks, useTaskStats } from "../../../../hooks/useTasks";
import { useTaskTimers } from "../../../../hooks/useTaskTimers";
import { useTimeLogActions } from "../../../../hooks/useTimeLogActions";
import { useTimelogs } from "../../../../hooks/useTimelogs";
import { useTimerMutations } from "../../../../hooks/useTimerMutations";
import { useUpdateTask } from "../../../../hooks/useUpdateTask";
import { useCreateEntity } from "../../../../hooks/useCreateEntity";
import { useFilteredProjectMembers } from "../../../../hooks/useTeamData";
import api from "../../../../lib/api";
import { useAuthStore } from "../../../../store/authStore";

export default function TasksPage() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;
  const { projectId } = useParams();
  const [deletingTask, setDeletingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");
  const [fetchMembers, setFetchMembers] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const hasActiveFilters = debouncedSearch || statusFilter !== "ALL" || priorityFilter !== "ALL" || assigneeFilter !== "ALL";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setAssigneeFilter("ALL");
  };

  const { data: projectMembers } = useFilteredProjectMembers(
    projectId,
    fetchMembers && (userRole === "ADMIN" || userRole === "MANAGER")
  );

  const activeFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    ...(priorityFilter !== "ALL" && { priority: priorityFilter }),
    ...(assigneeFilter !== "ALL" && { assigneeId: assigneeFilter }),
  };

  const {
    tasks: tasksData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useTasks(projectId, activeFilters);

  const { data: stats } = useTaskStats(projectId);

  const {
    activeTimer,
    hasActiveTimer,
    isTimerActive,
    durations,
    refetchDurations,
  } = useTaskTimers();

  const deleteMutation = useCreateEntity(
    (taskId) => api.delete(`/tasks/${taskId}`),
    [["tasks"], ["team", "overview"], ["timelogs"], ["taskStats"]],
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
    updateError,
  } = useTimeLogActions(
    invalidateTaskTimelogs,
    refetchDurations,
    refreshTaskTimelogs,
  );

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
      {(userRole === "USER" || userRole === "MANAGER") && (
        <div className="flex items-start gap-2.5 p-3 m-6  mb-0 rounded-lg bg-blue-50 border border-blue-100">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-[12px] text-blue-700 leading-relaxed">
            <span className="font-semibold">Heads up!</span> You can only log time for one task at a time. If your new entry overlaps with an existing one, you'll need to adjust the times before saving.
          </p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900 flex items-center gap-2">
              Tasks Overview
              {stats?.projectStatus === "ARCHIVED" && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                  Archived
                </span>
              )}
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
            {(userRole === "ADMIN" || userRole === "MANAGER") ? (
              <div
                title={stats?.projectStatus === "ARCHIVED" ? "Cannot create tasks in an archived project" : ""}
                className={stats?.projectStatus === "ARCHIVED" ? "cursor-not-allowed" : ""}
              >
                <Link href={stats?.projectStatus === "ARCHIVED" ? "#" : `/tasks/create?projectId=${projectId}`}>
                  <Button
                    size="sm"
                    className={`text-[12px] h-8 ${stats?.projectStatus === "ARCHIVED" ? "pointer-events-none" : ""}`}
                    disabled={stats?.projectStatus === "ARCHIVED"}
                  >
                    <Plus className="w-3 h-3 mr-1" /> New Task
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard
            label="Total Tasks"
            value={stats?.total || 0}
            sub={`${stats?.total || 0} tasks`}
          />
          <StatCard
            label="In Progress"
            value={stats?.inProgress || 0}
            sub="Currently working"
          />
          <StatCard
            label="Completed"
            value={stats?.completed || 0}
            sub="Finished tasks"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg mb-6 p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tasks by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-[13px]"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9 text-[13px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px] h-9 text-[13px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="1">High</SelectItem>
              <SelectItem value="2">Medium</SelectItem>
              <SelectItem value="3">Low</SelectItem>
            </SelectContent>
          </Select>

          {(userRole === "ADMIN" || userRole === "MANAGER") && (
            <Select
              value={assigneeFilter}
              onValueChange={setAssigneeFilter}
              onOpenChange={(open) => {
                if (open) setFetchMembers(true);
              }}
            >
              <SelectTrigger className="w-[160px] h-9 text-[13px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Assignees</SelectItem>
                {userRole === "MANAGER" && user && (
                  <SelectItem value={user.id.toString()}>
                    {user.name} (current user)
                  </SelectItem>
                )}
                {projectMembers?.map((member) => (
                  <SelectItem key={member.user.id} value={member.user.id.toString()}>
                    {member.user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-[13px] text-slate-500 hover:text-slate-900 px-2"
            >
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-[13px] font-semibold text-slate-900">
              All Tasks
            </h3>
          </div>
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-[13px] font-medium">Loading tasks...</p>
            </div>
          ) : tasksData?.length === 0 ? (
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
                  <div
                    title={stats?.projectStatus === "ARCHIVED" ? "Cannot create tasks in an archived project" : ""}
                    className={stats?.projectStatus === "ARCHIVED" ? "cursor-not-allowed w-max mx-auto" : ""}
                  >
                    <Link href={stats?.projectStatus === "ARCHIVED" ? "#" : `/tasks/create?projectId=${projectId}`}>
                      <Button
                        className={`bg-[#0f172a] hover:bg-[#0f172a]/90 text-white h-10 px-6 ${stats?.projectStatus === "ARCHIVED" ? "pointer-events-none" : ""}`}
                        disabled={stats?.projectStatus === "ARCHIVED"}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Create Task
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-[12px] text-slate-400">
                  No tasks have been assigned to you yet.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      {[
                        "Title",
                        "Created By",
                        ...(userRole === "USER" ? [] : ["Assignee"]),
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
                        isArchived={stats?.projectStatus === "ARCHIVED"}
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
                        currentUser={user}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-6 mb-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full max-w-[200px]"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load More Tasks"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <EditTimeLogModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editingTimeLog={editingTimeLog}
        onFieldChange={handleFieldChange}
        onUpdate={handleUpdateTimeLog}
        error={updateError}
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
