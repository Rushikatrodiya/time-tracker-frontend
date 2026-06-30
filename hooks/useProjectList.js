import api from "@/lib/api";
import useQueryHook from "./useQuery";

export const useProjectList = (enabled = true) => {
  const { data: projectsData, isLoading: projectsLoading } = useQueryHook({
    key: ["projects", "list"],
    fn: () => api.get("/projects/list"),
    select: (res) => res.data.data,
    enabled: enabled,
  });

  return {
    projects: projectsData || [],
    isLoading: projectsLoading,
  };
};
