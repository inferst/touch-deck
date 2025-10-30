import { Icon } from "@workspace/ui/components/Icon";
import { cn } from "@workspace/ui/lib/utils";
import { IconName } from "lucide-react/dynamic";
import { useState } from "react";

type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type CornerRadius = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type IconSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type FontSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Align = "bottom" | "middle" | "top";

type DeckCellButtonProps = {
  id: number;
  width: number;
  height: number;
  icon?: string;
  text?: string;
  textColor?: string;
  iconColor?: string;
  backgroundColor?: string;
  textAlign?: Align;
  textSize?: FontSize;
  iconSize?: IconSize;
  spacing?: Spacing;
  cornerRadius?: CornerRadius;
  onClick?: (event: React.MouseEvent) => void;
  onPointerDown?: (event: React.PointerEvent) => void;
  onPointerUp?: (event: React.PointerEvent) => void;
  onDrop?: (id: string) => void;
};

export function DeckCellButton(props: DeckCellButtonProps) {
  const {
    id,
    width,
    height,
    icon,
    text,
    textColor = "#fff",
    iconColor = "#fff",
    backgroundColor = "#444",
    textAlign = "bottom",
    textSize = 4,
    iconSize = 4,
    spacing = 4,
    cornerRadius = 4,
    onClick,
    onPointerDown,
    onPointerUp,
    onDrop,
  } = props;

  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (event: React.PointerEvent) => {
    if (onPointerDown) {
      event.preventDefault();
      onPointerDown(event);
    }
  };

  const handleEnd = (event: React.PointerEvent) => {
    if (onPointerUp) {
      event.preventDefault();
      onPointerUp(event);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDrop) {
      e.dataTransfer.setData("text/plain", id.toString());
      setIsDragging(true);
    }
  };

  const handleDragEnd = () => {
    if (onDrop) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (onDrop) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop) {
      const id = e.dataTransfer.getData("text/plain");
      e.preventDefault();
      onDrop(id);
    }
  };

  const styleProps = {
    "--width": `${width}%`,
    "--height": `${height}%`,
    "--text-color": textColor,
    "--bg-color": backgroundColor,
    "--spacing": `${spacing * 0.25}%`,
    // "--scale": `clamp(100%, ${100 + (spacing * spacing) / 2}%, 110%)`,
    "--scale": `110%`,
    "--corner-radius": `${cornerRadius * 5}%`,
    "--icon-size": `${iconSize * 10}cqw`,
    "--font-size": `${10 + (textSize * textSize) / 2}cqw`,
    "--opatcity": (isDragging ? 0.5 : 1) * 100,
  } as React.CSSProperties;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      key={id}
      onClick={onClick}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "relative",
        "w-[var(--width)]",
        "@container",
        "truncate",
        "select-none",
        "cursor-pointer",
        "m-[var(--spacing)]",
        "bg-[var(--bg-color)]",
        "rounded-[var(--corner-radius)]",
        "hover:scale-[var(--scale)] hover:z-10",
        "active:scale-[var(--scale)] active:z-10",
        "opacity-[var(--opactity)]",
        "border-2 border-[#333]"
      )}
      style={styleProps}
    >
      {icon && (
        <Icon
          name={icon as IconName}
          color={iconColor}
          size="100%"
          className={cn("max-w-[var(--icon-size)]")}
        />
      )}
      <span
        className={cn("absolute", {
          "text-[var(--text-color)]": textColor,
          "bottom-[0%]": textAlign == "bottom",
          "top-[0%]": textAlign == "top",
        })}
        style={{
          // lineHeight: 1,
          fontSize: "var(--font-size)",
        }}
      >
        {text}
      </span>
    </div>
  );
}
