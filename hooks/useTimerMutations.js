import { useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { useTimerStore } from "../store/timerStore";
import { useTimerMutation } from "./useTimerMutation";

export const useTimerMutations = (refetchDurations, fetchTimelogsForTask) => {
  const { startTimer, stopTimer } = useTimerStore();
  const queryClient = useQueryClient();

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
          queryClient.invalidateQueries({ queryKey: ["timelogs", "durations"] });
          queryClient.invalidateQueries({ queryKey: ["team", "summary"] });
          queryClient.invalidateQueries({ queryKey: ["team", "overview"] });
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
          queryClient.invalidateQueries({ queryKey: ["timelogs"] });
          queryClient.invalidateQueries({ queryKey: ["timelogs", "durations"] });
          queryClient.invalidateQueries({ queryKey: ["timelogs", "task", taskId] });
          queryClient.invalidateQueries({ queryKey: ["team", "summary"] });
          queryClient.invalidateQueries({ queryKey: ["team", "overview"] });
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
