import { useSettingsQuery } from "@/queries/settings";
import {
  StreamerbotClient,
  StreamerbotClientOptions,
} from "@streamerbot/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export function useStreamerbotClient() {
  const { data, isSuccess } = useSettingsQuery();

  const queryClient = useQueryClient();

  const [streamerbotClient, setStreamerbotClient] =
    useState<StreamerbotClient>();

  const options = useMemo(() => {
    const options: Partial<StreamerbotClientOptions> = {};

    if (data) {
      if (data.streamerbot.host) {
        options.host = data.streamerbot.host;
      }
    }

    return options;
  }, [data?.streamerbot]);

  function invalidateActions() {
    queryClient.invalidateQueries({ queryKey: ["actions"] });
  }

  function clearActions() {
    queryClient.setQueryData(["actions"], () => []);
  }

  useEffect(() => {
    if (isSuccess) {
      if (streamerbotClient) {
        setStreamerbotClient(undefined);
        clearActions();
      }

      const client = new StreamerbotClient({
        autoReconnect: false,
        immediate: false,
        ...options,
      });

      client.connect().then(() => {
        setStreamerbotClient(client);

        client.on("Application.ActionAdded", invalidateActions);
        client.on("Application.ActionUpdated", invalidateActions);
        client.on("Application.ActionDeleted", invalidateActions);
      });
    }

    return () => {};
  }, [options, isSuccess]);

  return streamerbotClient;
}
