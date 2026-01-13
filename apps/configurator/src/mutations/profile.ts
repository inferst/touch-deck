import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LayoutDto } from "@workspace/deck/dto/LayoutDto";
import { StyleDto } from "@workspace/deck/dto/StyleDto";

export function useSetLayoutMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (layout: LayoutDto) => api.setLayout(layout),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "layout"] });
    },
  });

  return mutation;
}

export function useSetStyleMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (style: StyleDto) => api.setStyle(style),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "style"] });
    },
  });

  return mutation;
}
