import { useCreateEntity } from "./useCreateEntity";
import api from "../lib/api";

export const useProjectTeam = (projectId) => {
  const addMember = useCreateEntity(
    (userId) => api.post(`/project-members/${projectId}/members`, { userId }),
    ["project-members", projectId],
  );
  const removeMember = useCreateEntity(
    (userId) => api.delete(`/project-members/${projectId}/members/${userId}`),
    ["project-members", projectId],
  );
  return { addMember, removeMember };
};
