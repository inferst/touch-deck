import { useSettingsQuery } from "@/queries/settings";
import {
  StreamerbotClient,
  StreamerbotClientOptions,
} from "@streamerbot/client";
import { useQueryClient } from "@tanstack/react-query";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";

export type Streamerbot = {
  client: RefObject<StreamerbotClient | null>,
  isReady: boolean,
}

export function useStreamerbotClient(): Streamerbot {
  const { data, isSuccess } = useSettingsQuery();

  const [isReady, setIsReady] = useState(false);

  const queryClient = useQueryClient();

  const streamerbotClient = useRef<StreamerbotClient | null>(null);

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
  }, [data]);

  const invalidateActions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["actions"] });
  }, [queryClient]);

  const clearActions = useCallback(() => {
    queryClient.setQueryData(["actions"], () => []);
  }, [queryClient]);

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

    streamerbotClient.current = client;

    if (isSuccess) {
      client.connect().then(() => {
        setIsReady(true);
        invalidateActions();

        client.on("Application.ActionAdded", invalidateActions);
        client.on("Application.ActionUpdated", invalidateActions);
        client.on("Application.ActionDeleted", invalidateActions);
      });
    }

    return () => {
      client.disconnect();
    };
  }, [options, isSuccess, clearActions, invalidateActions]);

  return useMemo(() => ({
    client: streamerbotClient,
    isReady,
  }), [isReady, streamerbotClient]);
}
