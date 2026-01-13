import { api } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useLayoutQuery(profileId: number) {
  const query = useSuspenseQuery({
    queryKey: ["profile", "layout", profileId],
    queryFn: () => api.getLayout(profileId),
  });

  return query;
}

export function useStyleQuery(profileId: number) {
  const query = useSuspenseQuery({
    queryKey: ["profile", "style", profileId],
    queryFn: () => api.getStyle(profileId),
  });

  return query;
}

export function useProfilesQuery() {
  const query = useSuspenseQuery({
    queryKey: ["profiles"],
    queryFn: () => api.getProfiles(),
  });

  return query;
}
