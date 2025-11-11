import { useDeckQuery } from "@/queries/deck";
import { Deck } from "@workspace/deck/types/board";
import { createContext, useContext } from "react";

export const DeckContext = createContext<Deck | undefined>(undefined);

export const useDeckContext = () => {
  const context = useContext(DeckContext);

  if (!context) {
    throw new Error("useDeckContext has to be used within <DeckProvider>");
  }

  return context;
};

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const query = useDeckQuery();

  if (query.isPending) {
    return "Loading...";
  }

  if (query.isError) {
    return query.error.message;
  }

  return (
    <DeckContext.Provider value={query.data}>{children}</DeckContext.Provider>
  );
};
