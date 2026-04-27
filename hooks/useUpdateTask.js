import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status, priority, title }) => {
      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (title !== undefined) updateData.title = title;

      return api.patch(`/tasks/${taskId}`, updateData);
    },
    onSuccess: () => {
      // Refetch tasks to update the UI
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });
}
