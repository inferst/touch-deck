import { DeckGridCell } from "@workspace/deck/components/DeckGridCell";
import { BorderRadius, Cell } from "@workspace/deck/types/board";
import { cn } from "@workspace/utils/cn";
import { useLogRenders } from "@workspace/utils/debug";

type DeckPageButtonProps = {
  cell?: Cell;
  borderRadius?: BorderRadius;
  borderWidth?: number;
  onPointerDown?: (id: string) => void;
  onPointerUp?: (id: string) => void;
};

export function DeckItem(props: DeckPageButtonProps) {
  useLogRenders("DeckItem");

  const { cell, borderRadius, borderWidth, onPointerDown, onPointerUp } = props;

  const handlePointerUp = () => {
    if (cell?.data?.type == "streamerbot.action") {
      const id = cell?.data?.releaseAction?.id;

      if (id) {
        onPointerUp?.(id);
      }
    }
  };

  const handlePointerDown = () => {
    if (cell?.data?.type == "streamerbot.action") {
      const id = cell?.data?.pressAction?.id;

      if (id) {
        onPointerDown?.(id);
      }
    }
  };

  return (
    <DeckGridCell
      text={cell?.title?.title}
      icon={cell?.icon?.icon}
      backgroundColor={cell?.background?.color}
      borderRadius={borderRadius}
      borderWidth={borderWidth}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={cn("active:scale-90")}
    />
  );
}
