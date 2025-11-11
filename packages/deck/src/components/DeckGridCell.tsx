import { useDeckGridContext } from "@workspace/deck/components/DeckGridContext";
import {
  DeckGridItem,
  DeckGridItemProps,
} from "@workspace/deck/components/DeckGridItem";
import { useLogRenders } from "@workspace/utils/debug";
import { memo } from "react";

export type DeckGridCellProps = {} & DeckGridItemProps;

export const DeckGridCell = memo((props: DeckGridCellProps) => {
  useLogRenders("DeckGridCell");

  const deck = useDeckGridContext();

  return <DeckGridItem {...props} borderWidth={deck.borderWidth} />;
});
