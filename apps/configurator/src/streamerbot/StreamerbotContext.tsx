import { Streamerbot, useStreamerbotClient } from "@/streamerbot/useStreamerbotClient";
import { createContext, useContext } from "react";

export const StreamerbotContext = createContext<Streamerbot | undefined>(
  undefined,
);

export const useStreamerbot = () => {
  const context = useContext(StreamerbotContext);

  if (!context) {
    throw new Error(
      "useStreamerbot has to be used within <StreamerbotProvider>",
    );
  }

  return context;
};

export const StreamerbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const streamerbot = useStreamerbotClient();

  return (
    <StreamerbotContext.Provider value={streamerbot}>
      {children}
    </StreamerbotContext.Provider>
  );
};
