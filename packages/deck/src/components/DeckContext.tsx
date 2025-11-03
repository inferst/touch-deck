import { createContext, useContext } from "react";

type DeckGridContextValue = {
  borderWidth: number;
};

export const DeckGridContext = createContext<DeckGridContextValue | undefined>(
  undefined,
);

export const useDeckGrid = () => {
  const context = useContext(DeckGridContext);

  if (!context) {
    throw new Error("useDeckGrid has to be used within <DeckGridContext.Provider>");
  }

  return context;
};
