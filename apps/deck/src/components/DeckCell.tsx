import { DeckCell as DeckCellComponent } from "@workspace/deck/components/DeckCell";
import { BorderRadius, Cell } from "@workspace/deck/types/board";

type DeckPageButtonProps = {
  cell?: Cell;
  borderRadius?: BorderRadius;
  borderWidth?: number;
  onPointerDown?: (id: string) => void;
  onPointerUp?: (id: string) => void;
};

export function DeckCell(props: DeckPageButtonProps) {
  const { cell, borderRadius, borderWidth, onPointerDown, onPointerUp } = props;

  const handlePointerUp = () => {
    // if (cell?.endActionId) {
    //   onPointerUp?.(cell.endActionId);
    // }
  };

  const handlePointerDown = () => {
    // if (cell?.startActionId) {
    //   onPointerDown?.(cell.startActionId);
    // }
  };

  return (
    <DeckCellComponent
      text={cell?.title?.title}
      icon={cell?.icon?.icon}
      backgroundColor={cell?.background?.color}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
}
