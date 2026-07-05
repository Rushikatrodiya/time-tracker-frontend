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
    onSuccess: (data, variables) => {
      const taskId = variables?.taskId;
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      }
      queryClient.invalidateQueries({ queryKey: ["team", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["taskStats"] });
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });
}
