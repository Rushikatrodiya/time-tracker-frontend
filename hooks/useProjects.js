import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import useQueryHook from "./useQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProjects = () => {
  const { user } = useAuthStore();
  const userRole = user?.role;

  const { data: projectsData, isLoading: projectsLoading } = useQueryHook({
    key: ["projects"],
    fn: () => api.get("/projects"),
    enabled: userRole === "ADMIN" || userRole === "MANAGER",
    select: (res) => res.data.data,
  });

  return {
    projects: projectsData || [],
    isLoading: projectsLoading,
    hasProjects: (projectsData?.length || 0) > 0,
  };
};

export const useUpdateProject = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, ...data }) => api.patch(`/projects/${projectId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};
