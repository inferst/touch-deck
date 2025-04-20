import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppState = {
  status: StreamerbotStatus;
};

export type StreamerbotStatus = "connected" | "disconnected";

export type AppContextValue = {
  status: StreamerbotStatus;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext has to be used within <AppProvider>");
  }

  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AppContextValue>({
    status: "disconnected",
  });

  useEffect(() => {
    const listener = listen<AppState>("state-update", (event) => {
      setState(event.payload);
    });

    invoke<AppState>("get_state").then((payload) => {
      setState(payload);
    });

    return () => {
      listener.then((unlisten) => unlisten());
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
