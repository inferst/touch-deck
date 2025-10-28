import { api } from "@/api";
import { store } from "@/store";
import { Deck } from "@/types/deck";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function saveDeck(settings: Deck) {
  await store.set("pages", settings.pages);
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
