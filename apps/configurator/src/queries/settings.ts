import { store } from "@/store";
import { Settings, StreamerbotSettings } from "@/types/settings";
import { useQuery } from "@tanstack/react-query";

async function getSettings(): Promise<Settings> {
  const streamerbot: StreamerbotSettings = (await store.get("streamerbot")) ?? {
    host: "",
  };

  return { streamerbot };
}

export function useSettingsQuery() {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
  });

  return query;
}
