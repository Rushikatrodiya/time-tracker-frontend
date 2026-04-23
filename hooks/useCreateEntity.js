import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEntity = (apiFn, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
