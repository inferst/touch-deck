import {
  StreamerbotContextValue,
  useStreamerbot,
} from "@/hooks/useStreamerbotClient";
import { createContext, useContext } from "react";

export const StreamerbotContext = createContext<
  StreamerbotContextValue | undefined
>(undefined);

export const useStreamerbotContext = () => {
  const context = useContext(StreamerbotContext);

  if (!context) {
    throw new Error(
      "useStreamerbotContext has to be used within <StreamerbotProvider>",
    );
  }

  return context;
};

export const StreamerbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const data = useStreamerbot();

  console.log("streamerbot", data);

  return (
    <StreamerbotContext.Provider value={data}>
      {children}
    </StreamerbotContext.Provider>
  );
};
