import { DeckGridCell as DeckCellComponent } from "@workspace/deck/components/DeckGridCell";
import { BorderRadius, Cell } from "@workspace/deck/types/board";
import { useLogRenders } from "@workspace/utils/debug";

type DeckPageButtonProps = {
  cell?: Cell;
  borderRadius?: BorderRadius;
  borderWidth?: number;
  onPointerDown?: (id: string) => void;
  onPointerUp?: (id: string) => void;
};

export function DeckCell(props: DeckPageButtonProps) {
  useLogRenders('DeckCell');

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
