import { useDeckGrid } from "@workspace/deck/components/DeckContext";
import { DeckItem, DeckItemProps } from "@workspace/deck/components/DeckItem";
import { memo, useCallback, useState } from "react";

export type DeckCellProps = {} & DeckItemProps;

export const DeckCell = memo((props: DeckCellProps) => {
  const deck = useDeckGrid();
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  return (
    <DeckItem
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
