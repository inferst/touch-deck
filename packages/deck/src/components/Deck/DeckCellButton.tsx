import { DeckButton } from "@workspace/deck/types/deck";
import { Icon } from "@workspace/ui/components/Icon";
import { cn } from "@workspace/ui/lib/utils";
import { MinusIcon } from "lucide-react";
import { IconName } from "lucide-react/dynamic";
import { useState } from "react";

type DeckCellButtonProps = {
  width: number;
  button: DeckButton;
  onClick?: (event: React.MouseEvent) => void;
  onStart?: (id: string) => void;
  onEnd?: (id: string) => void;
};

export function DeckCellButton(props: DeckCellButtonProps) {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();

    if (props.button.startActionId) {
      props.onStart?.(props.button.startActionId);
    }

    setIsStarted(true);
  };

  const handleEnd = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();

    if (props.button.endActionId) {
      props.onEnd?.(props.button.endActionId);
    }

    setIsStarted(false);
  };

  const icon = props.button.icon as IconName;

  return (
    <div
      key={props.button.id}
      onClick={props.onClick}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
      className={cn(
        isStarted && "scale-110",
        "select-none",
        "truncate",
        "m-[1.25%]",
        "rounded-[calc(10%)]",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "cursor-pointer",
        "relative",
        "overflow-hidden",
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
      <div className="absolute flex flex-col items-center">
        {icon && <Icon name={icon} />}
        {props.button.title ? props.button.title : <MinusIcon />}
      </div>
    </div>
  );
}
