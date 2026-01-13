import { create } from "zustand";

export type AppStore = {
  selectedBoardId: number | null;
  setSelectedBoard: (id: number) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  selectedBoardId: null,
  setSelectedBoard: (id: number) => {
    set({
      selectedBoardId: id,
    });
  },
}));
