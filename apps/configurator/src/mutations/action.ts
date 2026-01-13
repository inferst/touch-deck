import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateActionDto } from "@workspace/deck/dto/CreateActionDto";

export function useSetActionMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (action: CreateActionDto) => api.setAction(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });

  if (mutation.error) {
    throw mutation.error;
  }

  return mutation;
}

export function useSwapItemsMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      row1,
      col1,
      row2,
      col2,
    }: {
      row1: number;
      col1: number;
      row2: number;
      col2: number;
    }) => api.swapItems(row1, col1, row2, col2),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board"] });
    },
  });

  return mutation;
}
