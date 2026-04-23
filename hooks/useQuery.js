import { useQuery } from "@tanstack/react-query";

const useQueryHook = ({
  key,
  fn,
  enabled = true,
  select,
  staleTime = 5 * 60 * 1000, // default 5 min
}) => {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    enabled,
    select,
    staleTime,
    retry: 1, // optional: avoid too many retries
  });
};

export default useQueryHook;