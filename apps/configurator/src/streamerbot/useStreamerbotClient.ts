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

      if (data.streamerbot.port) {
        options.port = data.streamerbot.port;
      }

      if (data.streamerbot.endpoint) {
        options.endpoint = data.streamerbot.endpoint;
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
    const client = new StreamerbotClient({
      autoReconnect: false,
      immediate: false,
      retries: 0,
      onDisconnect: () => {
        clearActions();
      },
      ...options,
    });

    setStreamerbotClient(client);

    if (isSuccess) {
      client.connect().then(() => {
        invalidateActions();

        client.on("Application.ActionAdded", invalidateActions);
        client.on("Application.ActionUpdated", invalidateActions);
        client.on("Application.ActionDeleted", invalidateActions);
      });
    }

    return () => {
      client.disconnect();
    };
  }, [options, isSuccess]);

  return streamerbotClient;
}
