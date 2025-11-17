import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Plugins } from "@workspace/deck/types/plugin";

async function getPlugins(): Promise<Plugins> {
  const plugins = await api.getPluginsData();

  console.log('plugins', plugins);

  return plugins;

  // try {
  //   const parsed = DeckSettingsDefaultSchema.parse(settings);
  //   return parsed;
  // } catch (error) {
  //   console.error("Missing default fields", error);
  //   throw error;
  // }
}

export function usePluginsQuery() {
  const query = useQuery({
    queryKey: ["plugins"],
    queryFn: () => getPlugins(),
    throwOnError: true,
  });

  return query;
}
