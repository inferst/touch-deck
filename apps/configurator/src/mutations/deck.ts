import { store } from "@/store";
import { Deck } from "@/types/deck";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";

async function saveDeck(settings: Deck) {
  await store.set("pages", settings.pages);
  await store.save();

  invoke("deck_update");
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
