import { useStreamerbotClient } from "@/streamerbot/useStreamerbotClient";
import { StreamerbotClient } from "@streamerbot/client";
import { createContext, useContext, useMemo } from "react";

export const StreamerbotContext = createContext<StreamerbotClient | undefined>(
  undefined,
);

export const useStreamerbot = () => {
  const context = useContext(StreamerbotContext);

  // if (!context) {
  //   throw new Error(
  //     "useStreamerbot has to be used within <StreamerbotProvider>",
  //   );
  // }

  return context;
};

export const StreamerbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const streamerbotClient = useStreamerbotClient();
  const value = useMemo(() => streamerbotClient, [streamerbotClient]);

  return (
    <StreamerbotContext.Provider value={value}>
      {children}
    </StreamerbotContext.Provider>
  );
};
