import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTimerMutation = (apiFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiFn,
    // No automatic query invalidation for timer operations
    // Timer state is managed manually in the component
  });
};
