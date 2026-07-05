import api from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import useQueryHook from "./useQuery";

export const useTasks = (projectId, filters = {}) => {
  const { 
    data, 
    isLoading: tasksLoading, 
    error, 
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["tasks", projectId, filters].filter(Boolean),
    queryFn: ({ pageParam = null }) => {
      const url = projectId ? `/tasks/${projectId}` : "/tasks";
      return api.get(url, { params: { cursor: pageParam, ...filters } });
    },
    getNextPageParam: (lastPage) => lastPage.data.data.pagination.nextCursor || undefined,
  });

  const tasksData = data?.pages.flatMap((page) => page.data.data.tasks) || [];

  return {
    tasks: tasksData,
    isLoading: tasksLoading,
    hasTasks: tasksData.length > 0,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  };
};

export const useTaskStats = (projectId) => {
  return useQueryHook({
    key: ["taskStats", projectId],
    fn: () => api.get(`/tasks/${projectId}/stats`),
    enabled: !!projectId,
    select: (res) => res.data.data,
  });
};
