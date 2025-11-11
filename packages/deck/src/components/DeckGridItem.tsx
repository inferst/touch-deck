import {
  BorderRadius,
  FontSize,
  IconSize,
  TextAlign,
} from "@workspace/deck/types/board";
import { Icon } from "@workspace/ui/components/icon";
import { cn } from "@workspace/ui/lib/utils";
import { useLogRenders } from "@workspace/utils/debug";
import { mergeRefs } from "@workspace/utils/mergeRefs";
import { IconName } from "lucide-react/dynamic";
import { memo, RefObject, useRef } from "react";

export type DeckGridItemProps = {
  ref?: RefObject<HTMLDivElement | null>;
  icon?: string;
  text?: string;
  textColor?: string;
  iconColor?: string;
  backgroundColor?: string;
  textAlign?: TextAlign;
  textSize?: FontSize;
  iconSize?: IconSize;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: BorderRadius;
  onClick?: (event: React.MouseEvent) => void;
  onPointerDown?: (event: React.PointerEvent) => void;
  onPointerUp?: (event: React.PointerEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
};

export const DeckGridItem = memo((props: DeckGridItemProps) => {
  useLogRenders('DeckGridItem');

  const {
    ref,
    icon,
    text,
    textColor = "#fff",
    iconColor = "#fff",
    backgroundColor = "#444",
    textAlign = "bottom",
    textSize = 4,
    iconSize = 4,
    borderWidth = 0,
    borderColor = "#222",
    borderRadius = 2,
    onClick,
    onPointerDown,
    onPointerUp,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const innerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (onPointerDown) {
      event.preventDefault();
      onPointerDown(event);
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (onPointerUp) {
      event.preventDefault();
      onPointerUp(event);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    onMouseLeave?.(event);
  };

  const styleProps = {
    "--text-color": textColor,
    "--bg-color": backgroundColor,
    "--icon-size": `${iconSize * 10}cqw`,
    "--font-size": `${10 + (textSize * textSize) / 2}cqw`,
    "--border-radius": `${borderRadius * 5}%`,
    "--border-width": `${borderWidth}px`,
    "--border-color": borderColor,
  } as React.CSSProperties;

  return (
    <div
      ref={mergeRefs(ref, innerRef)}
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "relative",
        "w-full",
        "h-full",
        "@container",
        "truncate",
        "select-none",
        "cursor-pointer",
        "bg-(--bg-color)",
        "active:scale-90",
        "active:z-10",
        "rounded-(--border-radius)",
        "border-(length:--border-width)",
        "border-(--border-color)",
      )}
      style={styleProps}
    >
      {icon && (
        <Icon
          name={icon as IconName}
          color={iconColor}
          size="100%"
          className={cn("max-w-(--icon-size)")}
        />
      )}
      <span
        className={cn("absolute", "text-(length:--font-size)", {
          "text-(--text-color)": textColor,
          "bottom-0": textAlign == "bottom",
          "top-0": textAlign == "top",
        })}
      >
        {text}
      </span>
    </div>
  );
});
