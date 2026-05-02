import api from "../lib/api";
import useQueryHook from "./useQuery";

export const useTeamSummary = () => {
  return useQueryHook({
    key: ["team-summary"],
    fn: () => api.get("/team/summary"),
    select: (res) => res.data.data,
  });
};

export const useTeamOverview = () => {
  return useQueryHook({
    key: ["team-overview"],
    fn: () => api.get("/team/overview"),
    select: (res) => res.data.data,
  });
};

export const useProjectMembers = (projectId) => {
  return useQueryHook({
    key: ["project-members", projectId],
    fn: () => api.get(`/project-members/${projectId}/members`),
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
