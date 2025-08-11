import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
    const listeners = [
      listen<AppState>("state_update", (event) => {
        setState({ ...state, status: event.payload.status });
      }),
      listen<ErrorEvent>("error", (event) => {
        setState({ ...state, error: event.payload.message });
      }),
    ];

    invoke<AppState>("get_state").then((payload) => {
      setState({ ...state, status: payload.status });
    });

    return () => {
      listeners.map((listener) => listener.then((unlisten) => unlisten()));
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
