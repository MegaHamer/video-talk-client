import { UseQueryOptions } from "@tanstack/react-query";

export const useQueryConfig = <T>(options?: UseQueryOptions<T>) => {
  return {
    staleTime: 60_000,
    ...options,
  };
};
