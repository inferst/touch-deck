import { useSettingsContext } from "@/context/SettingsContext";
import {
  StreamerbotAction,
  StreamerbotClient,
  StreamerbotClientOptions,
} from "@streamerbot/client";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ConnectionStatus = "connected" | "connecting" | "disconnected";

export type StreamerbotData = {
  status: ConnectionStatus;
  actions: StreamerbotAction[];
};

export type StreamerbotContextValue = {
  data: StreamerbotData;
  reconnect: () => void;
};

class StreamerbotClientWrapper {
  private promise = Promise.resolve();

  public client?: StreamerbotClient;

  connect(options: Partial<StreamerbotClientOptions>): Promise<void> {
    this.promise = this.promise.finally(async () => {
      this.client = new StreamerbotClient(options);
      console.error("connect");
      return this.client.connect();
    });

    return this.promise;
  }

  disconnect(): Promise<void> {
    this.promise = this.promise.finally(() => {
      console.error("disconnect");
      return this.client?.disconnect();
    });

    return this.promise;
  }
}

const wrapper = new StreamerbotClientWrapper();

export function useStreamerbot(): StreamerbotContextValue {
  const settings = useSettingsContext();

  const options = useMemo(() => {
    return settings.connection.streamerbot;
  }, [settings.connection.streamerbot]);

  const [data, setData] = useState<StreamerbotData>({
    status: "disconnected",
    actions: [],
  });

  const connect = useCallback(() => {
    async function setActions() {
      if (wrapper.client) {
        const response = await wrapper.client.getActions();

        if (response.status == "ok") {
          setData((current) => {
            return {
              ...current,
              status: "connected",
              actions: response.actions,
            };
          });
        }
      }
    }

    setData((current) => {
      return {
        ...current,
        status: "connecting",
      };
    });

    wrapper
      .connect({
        autoReconnect: false,
        immediate: false,
        retries: 0,
        onError: (error) => {
          console.error(error);
        },
        onConnect: () => {
          console.log("onConnect");
          setActions();
        },
        onDisconnect: () => {
          console.log("onDisconnect");
          setData((current) => {
            return {
              ...current,
              status: "disconnected",
            };
          });
        },
        ...options,
      })
      .then(() => {
        if (wrapper.client) {
          wrapper.client.on("Application.ActionAdded", setActions);
          wrapper.client.on("Application.ActionUpdated", setActions);
          wrapper.client.on("Application.ActionDeleted", setActions);
        }
      });
  }, [options]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    connect();

    return () => {
      wrapper.disconnect();
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    wrapper.disconnect();
    connect();
  }, [connect]);

  return useMemo(
    () => ({
      data,
      reconnect,
    }),
    [data, reconnect],
  );
}
