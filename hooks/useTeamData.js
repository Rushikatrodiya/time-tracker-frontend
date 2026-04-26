import useQueryHook from "./useQuery";
import api from "../lib/api";

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
