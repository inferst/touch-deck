import {
  StreamerbotClient,
  StreamerbotClientOptions,
} from "@streamerbot/client";
import { useEffect, useState } from "react";

export function useStreamerbotClient(
  options: Partial<StreamerbotClientOptions>,
) {
  const [streamerbotClient, setStreamerbotClient] =
    useState<StreamerbotClient>();

  useEffect(() => {
    let client: StreamerbotClient | undefined;

    if (options.host) {
      client = new StreamerbotClient({ autoReconnect: false, ...options });

      client
        .connect()
        .then(() => {
          setStreamerbotClient(client);
          console.log("Streamer bot connected");
        })
        .catch(() => {
          console.log("Streamer bot error");
          setStreamerbotClient(undefined);
        });
    }

    return () => {
      if (client) {
        client.disconnect().then(() => {
          console.log("Streamer bot disconnected");
        });
      }
    };
  }, [options]);

  return streamerbotClient;
}
