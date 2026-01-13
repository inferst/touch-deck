import { api } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useBoardQuery(boardId: number) {
  const query = useSuspenseQuery({
    queryKey: ["board", boardId],
    queryFn: () => api.getBoard(boardId),
  });

  if (query.error && !query.isFetching) {
    throw query.error;
  }

  return query;
}
