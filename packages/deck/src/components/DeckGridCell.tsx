import { useDeckGridContext } from "@workspace/deck/components/DeckGridContext";
import { DeckGridItem, DeckGridItemProps } from "@workspace/deck/components/DeckGridItem";
import { useLogRenders } from "@workspace/utils/debug";
import { memo, useCallback, useState } from "react";

export type DeckGridCellProps = {} & DeckGridItemProps;

export const DeckGridCell = memo((props: DeckGridCellProps) => {
  useLogRenders('DeckGridCell');

  const deck = useDeckGridContext();
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  return (
    <DeckGridItem
      {...props}
      icon={isHover && !props.icon ? "plus" : props.icon}
      iconSize={isHover && !props.icon ? 2 : props.iconSize}
      backgroundColor={
        isHover && !props.backgroundColor ? "#555555" : props.backgroundColor
      }
      borderWidth={deck.borderWidth}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
});
