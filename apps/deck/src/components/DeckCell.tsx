import { DeckCell as DeckCellComponent } from "@workspace/deck/components/DeckCell";
import { Cell } from "@workspace/deck/types";

type DeckPageButtonProps = {
  width: number;
  height: number;
  cell?: Cell;
  onPointerDown?: (id: string) => void;
  onPointerUp?: (id: string) => void;
};

export function DeckCell(props: DeckPageButtonProps) {
  const { width, height, cell, onPointerDown, onPointerUp } = props;

  const handlePointerUp = () => {
    if (cell?.endActionId) {
      onPointerUp?.(cell.endActionId);
    }
  };

  const handlePointerDown = () => {
    if (cell?.startActionId) {
      onPointerDown?.(cell.startActionId);
    }
  };

  return (
    <DeckCellComponent
      text={cell?.title}
      icon={cell?.icon}
      backgroundColor={cell?.color}
      width={width}
      height={height}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
}
