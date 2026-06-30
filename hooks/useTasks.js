import api from "@/lib/api";
import useQueryHook from "./useQuery";

export const useTasks = (projectId) => {
  const { data: tasksData, isLoading: tasksLoading, error, isError } = useQueryHook({
    key: ["tasks", projectId].filter(Boolean),
    fn: () => api.get(projectId ? `/tasks/${projectId}` : "/tasks"),
    select: (res) => res.data.data.tasks,
  });

  return {
    tasks: tasksData || [],
    isLoading: tasksLoading,
    hasTasks: (tasksData?.length || 0) > 0,
    error,
    isError,
  };
};
