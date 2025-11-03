import { useSettingsQuery } from "@/queries/settings";
import { DeckSettings } from "@workspace/deck/types/board";
import { createContext, useContext } from "react";

export const SettingsContext = createContext<DeckSettings | undefined>(
  undefined,
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettingsContext has to be used within <SettingsProvider>",
    );
  }

  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const query = useSettingsQuery();

  if (query.isPending) {
    return "Loading...";
  }

  if (query.isError) {
    return query.error.message;
  }

  return (
    <SettingsContext.Provider value={query.data}>
      {children}
    </SettingsContext.Provider>
  );
};
