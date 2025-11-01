import { Icon } from "@workspace/ui/components/Icon";
import { cn } from "@workspace/ui/lib/utils";
import { IconName } from "lucide-react/dynamic";
import { RefObject, useState } from "react";

type Spacing = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type BorderRadius = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type IconSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type FontSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type Align = "bottom" | "middle" | "top";

type DeckCellProps = {
  ref?: RefObject<HTMLDivElement | null>;
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
  borderColor?: string;
  borderRadius?: BorderRadius;
  onClick?: (event: React.MouseEvent) => void;
  onPointerDown?: (event: React.PointerEvent) => void;
  onPointerUp?: (event: React.PointerEvent) => void;
};

export function DeckCell(props: DeckCellProps) {
  const {
    ref,
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
    spacing = 0,
    borderColor = "#333",
    borderRadius = 0,
    onClick,
    onPointerDown,
    onPointerUp,
  } = props;

  const [activeScale, setActiveScale] = useState(100);

  const calculateActiveScale = () => {
    const element = ref?.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      setActiveScale(100 + (10 / rect.width) * 100);
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (onPointerDown) {
      event.preventDefault();
      onPointerDown(event);
      calculateActiveScale();
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (onPointerUp) {
      event.preventDefault();
      onPointerUp(event);
    }
  };

  const styleProps = {
    "--width": `${width}%`,
    "--height": `${height}%`,
    "--text-color": textColor,
    "--bg-color": backgroundColor,
    "--spacing": `${spacing * 0.25}cqw`,
    "--scale": `${activeScale}%`,
    "--border-radius": `${borderRadius * 5}%`,
    "--icon-size": `${iconSize * 10}cqw`,
    "--font-size": `${10 + (textSize * textSize) / 2}cqw`,
    "--border": borderColor,
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
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
        "cursor-pointer active:cursor-pointer",
        "m-[var(--spacing)]",
        "bg-[var(--bg-color)]",
        "opacity-[var(--opactity)]",
        "rounded-[var(--border-radius)]",
        "active:scale-[var(--scale)] active:z-10",
        "border-2 border-[var(--border)]",
      )}
      style={styleProps}
    >
      {icon && (
        <Icon
          name={icon as IconName}
          color={iconColor}
          size="100%"
          className={cn("max-w-[var(--icon-size)] not-any-pointer-coarse:")}
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
