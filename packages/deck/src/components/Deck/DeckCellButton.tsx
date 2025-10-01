import { DeckButton } from "@workspace/deck/types/deck";
import { Icon } from "@workspace/ui/components/Icon";
import { cn } from "@workspace/ui/lib/utils";
import { MinusIcon } from "lucide-react";
import { IconName } from "lucide-react/dynamic";
import { useState } from "react";

type DeckCellButtonProps = {
  id: number;
  width: number;
  button: DeckButton;
  isActionEnabled?: boolean;
  isDnDEnabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onStart?: (id: string) => void;
  onEnd?: (id: string) => void;
  onDrop?: (id: string) => void;
};

export function DeckCellButton(props: DeckCellButtonProps) {
  const {
    id,
    width,
    button,
    isActionEnabled = false,
    isDnDEnabled = false,
    onClick,
    onStart,
    onEnd,
    onDrop,
  } = props;

  const [isStarted, setIsStarted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (isActionEnabled) {
      event.preventDefault();

      if (button.startActionId) {
        onStart?.(button.startActionId);
      }

      setIsStarted(true);
    }
  };

  const handleEnd = (event: React.MouseEvent | React.TouchEvent) => {
    if (isActionEnabled) {
      event.preventDefault();

      if (button.endActionId) {
        onEnd?.(button.endActionId);
      }

      setIsStarted(false);
    }
  };

  const icon = button.icon as IconName;

  const handleDragStart = (e: React.DragEvent) => {
    if (isDnDEnabled) {
      e.dataTransfer.setData("text/plain", id.toString());
      setIsDragging(true);
    }
  };

  const handleDragEnd = () => {
    if (isDnDEnabled) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isDnDEnabled) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isDnDEnabled) {
      const id = e.dataTransfer.getData("text/plain");
      e.preventDefault();
      onDrop?.(id);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      key={id}
      onClick={onClick}
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
          "--width": `${width}%`,
          "--color": `${button.color}`,
          opacity: isDragging ? 0.5 : 1,
        } as React.CSSProperties
      }
    >
      <div className="absolute flex flex-col items-center">
        {icon && <Icon name={icon} />}
        {button.title ? button.title : <MinusIcon />}
      </div>
    </div>
  );
}
