import { store } from "@/store";
import { Settings } from "@/types/settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function saveSettings(settings: Settings) {
  await store.set("streamerbot", settings.streamerbot);
  await store.set("layout", settings.layout);
  await store.save();
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
