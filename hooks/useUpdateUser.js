import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

export const useUpdateUser = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      if (onSuccessCallback) onSuccessCallback(data);
    },
  });
};
