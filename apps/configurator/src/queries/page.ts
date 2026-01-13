import { api } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export function usePagesQuery(profileId: number) {
  const query = useSuspenseQuery({
    queryKey: ["pages", profileId],
    queryFn: () => api.getPages(profileId),
  });

  return query;
}
