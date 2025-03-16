import { useStreamerbotClient } from "@/streamerbot/use-streamerbot-client";
import {
  StreamerbotClient,
  StreamerbotClientOptions,
} from "@streamerbot/client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Streamerbot = {
  streamerbotClient?: StreamerbotClient;
  clientOptions: Partial<StreamerbotClientOptions>;
  setClientOptions: (options: Partial<StreamerbotClientOptions>) => void;
};

export const StreamerbotContext = createContext<Streamerbot | undefined>(
  undefined,
);

export const useStreamerbot = () => {
  const context = useContext(StreamerbotContext);

  if (!context) {
    throw new Error("useStreamerbot must be used within a StreamerbotProvider");
  }

  return context;
};

export const StreamerbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clientOptions, setClientOptions] = useState<
    Partial<StreamerbotClientOptions>
  >({});

  const streamerbotClient = useStreamerbotClient(clientOptions);

  const setOptions = useCallback(
    (options: Partial<StreamerbotClientOptions>) => {
      setClientOptions(options);
    },
    [],
  );

  const value = useMemo(
    () => ({
      streamerbotClient,
      clientOptions,
      setClientOptions: setOptions,
    }),
    [streamerbotClient, clientOptions, setOptions],
  );

  return (
    <StreamerbotContext.Provider value={value}>
      {children}
    </StreamerbotContext.Provider>
  );
};
