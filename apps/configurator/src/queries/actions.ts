import { useStreamerbot } from "@/streamerbot/StreamerbotContext";
import { StreamerbotClient } from "@streamerbot/client";
import { useQuery } from "@tanstack/react-query";

async function getActions(streamerbot: StreamerbotClient) {
  const actions = (await streamerbot.getActions()).actions;

  actions.sort((a, b) => {
    return a.group > b.group ? 1 : -1;
  });

  return actions;
}

export function useActionsQuery() {
  const streamerbot = useStreamerbot();
  const client = streamerbot.client.current;

  const query = useQuery({
    queryKey: ["actions"],
    queryFn: () => (client ? getActions(client) : []),
  });

  return query;
}
