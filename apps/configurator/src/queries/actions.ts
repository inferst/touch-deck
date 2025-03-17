import { useStreamerbot } from "@/streamerbot/StreamerbotContext";
import { StreamerbotClient } from "@streamerbot/client";
import { useQuery } from "@tanstack/react-query";

async function getActions(streamerbot: StreamerbotClient) {
  return (await streamerbot.getActions()).actions;
}

export function useActionsQuery() {
  const streamerbot = useStreamerbot();

  const query = useQuery({
    queryKey: ["actions"],
    queryFn: () => (streamerbot ? getActions(streamerbot) : []),
    enabled: !!streamerbot,
  });

  return query;
}
