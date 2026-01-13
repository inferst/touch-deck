import { usePagesQuery } from "@/queries/page";
import { Page } from "@workspace/deck/dto/Page";
import { createContext, useContext, useMemo, useState } from "react";

type AppData = {
  pages: Page[];
  selectedBoardId: number;
};

export const AppContext = createContext<AppData | undefined>(undefined);

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
  const query = usePagesQuery(1);

  const [selectedBoardId, setSelectedBoardId] = useState(0);

  const value = useMemo(() => {
    return {
      pages: query.data?.map((data) => data.page) ?? [],
      selectedBoardId,
    };
  }, [query.data, selectedBoardId]);

  if (query.isPending) {
    return "Loading...";
  }

  if (query.isError) {
    return query.error.message;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
