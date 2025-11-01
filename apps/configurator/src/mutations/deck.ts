import { api } from "@/api";
import { store } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Deck } from "@workspace/deck/types";

async function saveDeck(data: Deck) {
  await store.set("deck", data);
  await store.save();

  api.emitDeckUpdate();
}

export function useDeckMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveDeck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deck"] });
    },
  });

  return mutation;
}
