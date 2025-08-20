import { store } from "@/store";
import {
  LayoutSettings,
  Settings,
  StreamerbotSettings,
} from "@/types/settings";
import { useQuery } from "@tanstack/react-query";

async function getSettings(): Promise<Settings> {
  const streamerbot: StreamerbotSettings = (await store.get("streamerbot")) ?? {
    host: "",
    port: 8080,
    endpoint: "",
  };

  const layout: LayoutSettings = (await store.get("layout")) ?? {
    rows: 3,
    columns: 5,
  };

  const tray: boolean = (await store.get("tray")) ?? false;

  return { streamerbot, layout, tray };
}

export function useSettingsQuery() {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
  });

  return query;
}
