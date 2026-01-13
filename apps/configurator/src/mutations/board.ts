import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateBoardDto } from "@workspace/deck/dto/CreateBoardDto";

type CreateBoardParams = {
  board: CreateBoardDto;
  createPage: boolean;
};

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ board, createPage }: CreateBoardParams) =>
      api.createBoard(board, createPage),
    onSuccess: (_data, params) => {
      if (params.createPage) {
        queryClient.invalidateQueries({ queryKey: ["pages"] });
      }
    },
  });

  return mutation;
}

export function useDeleteBoardMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (boardId: number) => api.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  return mutation;
}
