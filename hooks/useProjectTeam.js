import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export const useProjectTeam = (projectId) => {
  const queryClient = useQueryClient();

  const addMember = useMutation({
    mutationFn: (userId) => api.post(`/project-members/${projectId}`, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["team", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["team", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const removeMember = useMutation({
    mutationFn: (userId) => api.delete(`/project-members/${projectId}/members/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["team", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return { addMember, removeMember };
};
