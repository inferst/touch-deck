import { cn } from "@workspace/ui/lib/utils";
import { PlusIcon } from "lucide-react";
import { DeckButton } from "src/types/deck";

type DeckCellButtonProps = {
  width: number;
  button: DeckButton;
  onClick?: (event: React.MouseEvent) => void;
  onStart?: (id: string) => void;
  onEnd?: (id: string) => void;
};

export function DeckCellButton(props: DeckCellButtonProps) {
  const handleStart = () => {
    if (props.button.startActionId) {
      props.onStart?.(props.button.startActionId);
    }
  };

  const handleEnd = () => {
    if (props.button.endActionId) {
      props.onEnd?.(props.button.endActionId);
    }
  };

  const isActive = props.button.startActionId || props.button.endActionId;

  return (
    <div
      key={props.button.id}
      onClick={props.onClick}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
      className={cn(
        "grow",
        "truncate",
        "m-[1.25%]",
        "rounded-[calc(10%)]",
        "flex",
        "items-center",
        "justify-center",
        "cursor-pointer",
        "relative",
        "w-[var(--width)]",
        "bg-[var(--color)]",
      )}
      style={
        {
          "--width": `${props.width}%`,
          "--color": `${props.button.color}`,
        } as React.CSSProperties
      }
    >
      {isActive ? props.button.title : <PlusIcon />}
    </div>
  );
}
