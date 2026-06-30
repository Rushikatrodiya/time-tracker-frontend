import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEntity = (apiFn, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiFn,
    onSuccess: () => {
      if (!queryKey) return;
      if (Array.isArray(queryKey[0])) {
        queryKey.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      } else {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};
