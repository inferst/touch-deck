import { store } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { DeckSettings } from "@workspace/deck/types/board";
import { DeckSettingsDefaultSchema } from "@workspace/deck/schema/settings";

async function getSettings(): Promise<DeckSettings> {
  const settings = (await store.get("settings")) ?? {};

  try {
    const parsed = DeckSettingsDefaultSchema.parse(settings);
    return parsed;
  } catch (error) {
    console.error("Missing default fields", error);
    throw error;
  }
}

export function useSettingsQuery() {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
    throwOnError: true,
  });

  return query;
}
