import api from "../lib/api";
import useQueryHook from "./useQuery";
export const useProjectMembers = (projectId) => {
  return useQueryHook({
    key: ["project-members", projectId],
    fn: () => api.get(`/project-members/${projectId}`),
    enabled: !!projectId,
    select: (res) => res.data.data,
  });
};

export const useFilteredProjectMembers = (projectId) => {
  return useQueryHook({
    key: ["filtered-project-members", projectId],
    fn: () => api.get(`/project-members/${projectId}/filtered`),
    enabled: !!projectId,
    select: (res) => res.data.data,
  });
};

export const useOrganizationMembers = (organizationId) => {
  return useQueryHook({
    key: ["organization-members", organizationId],
    fn: () => api.get(`/users?organizationId=${organizationId}`),
    enabled: !!organizationId,
    select: (res) => res.data.data,
  });
};
