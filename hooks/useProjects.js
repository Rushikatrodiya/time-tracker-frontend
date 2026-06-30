import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import useQueryHook from "./useQuery";

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
