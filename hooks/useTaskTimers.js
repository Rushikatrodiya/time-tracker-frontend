import { useEffect, useMemo } from "react";
import api from "../lib/api";
import { useTimerStore } from "../store/timerStore";
import useQueryHook from "./useQuery";

export const useTaskTimers = () => {
  const { activeTimer, startTimer, stopTimer } = useTimerStore();

  const { data: tasksDurationData, refetch: refetchDurations } = useQueryHook({
    key: ["tasks-durations"],
    fn: () => api.get("/timelogs/all-tasks/durations"),
    select: (res) => res.data.data,
  });

  const durations = useMemo(() => {
    if (!tasksDurationData) return {};
    const result = {};
    tasksDurationData.tasks.forEach((task) => {
      result[task.taskId] = task.totalDuration;
    });
    return result;
  }, [tasksDurationData]);

  // Restore active timer on page refresh
  useEffect(() => {
    if (tasksDurationData?.tasks) {
      const activeTask = tasksDurationData.tasks.find((t) => t.activeTimer);
      if (activeTask) {
        startTimer(
          String(activeTask.taskId),
          activeTask.activeTimer.startTime,
        );
      }
    }
  }, [tasksDurationData]);

  const hasActiveTimer = activeTimer !== null;

  const isTimerActive = (taskId) =>
    activeTimer?.taskId === String(taskId);

  return {
    activeTimer,
    hasActiveTimer,
    isTimerActive,
    startTimer,
    stopTimer,
    durations,
    refetchDurations,
  };
};