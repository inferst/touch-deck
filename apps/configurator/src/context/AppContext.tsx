import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { isTauri } from "@tauri-apps/api/core";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api";

export type AppState = {
  status: StreamerbotStatus;
};

export type ErrorEvent = {
  message: string;
};

export type StreamerbotStatus = "connected" | "connecting" | "disconnected";

export type AppContextValue = {
  status: StreamerbotStatus;
  error: string;
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
    error: "",
  });

  useEffect(() => {
    let listeners: Promise<UnlistenFn>[] = [];

    if (isTauri()) {
      listeners = [
        listen<AppState>("state_update", (event) => {
          setState({ ...state, status: event.payload.status });
        }),
        listen<ErrorEvent>("error", (event) => {
          setState({ ...state, error: event.payload.message });
        }),
      ];

      api.getStatus().then(status => {
        setState({ ...state, status });
      });
    }

    return () => {
      listeners.map((listener) => listener.then((unlisten) => unlisten()));
    };
  }, [state]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
