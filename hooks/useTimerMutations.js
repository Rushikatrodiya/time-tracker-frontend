import api from "../lib/api";
import { useTimerStore } from "../store/timerStore";
import { useTimerMutation } from "./useTimerMutation";

export const useTimerMutations = (refetchDurations, fetchTimelogsForTask) => {
  const { startTimer, stopTimer } = useTimerStore();

  const startMutation = useTimerMutation((data) =>
    api.post("/timelogs/start", data),
  );

  const stopMutation = useTimerMutation((data) =>
    api.post("/timelogs/end", data),
  );

  const handleStartTimer = (taskId, e) => {
    e.stopPropagation();
    startTimer(taskId, new Date().toISOString());

    startMutation.mutate(
      { taskId },
      {
        onSuccess: (response) => {
          startTimer(taskId, response.data.data.startTime);
        },
        onError: () => {
          stopTimer();
        },
      },
    );
  };

  const handleStopTimer = (taskId, e) => {
    e.stopPropagation();
    stopTimer();

    stopMutation.mutate(
      { taskId },
      {
        onSuccess: () => {
          if (fetchTimelogsForTask) fetchTimelogsForTask(taskId);
          refetchDurations();
        },
        onError: () => {
          startTimer(taskId, new Date().toISOString());
        },
      },
    );
  };

  return {
    handleStartTimer,
    handleStopTimer,
    isPending: startMutation.isPending || stopMutation.isPending,
  };
};
