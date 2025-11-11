import { api } from "@/api";
import { store } from "@/store";
import { DeckSettings } from "@workspace/deck/types/board";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function saveSettings(settings: DeckSettings) {
  await store.set("settings", settings);
  await store.save();

  api.emitSettingsUpdate();
}

export function useSettingsMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return mutation;
}
