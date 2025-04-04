import { cn } from "@workspace/ui/lib/utils";
import { PlusIcon } from "lucide-react";
import { DeckButton } from "src/types/deck";

type DeckCellButtonProps = {
  id: number;
  width: number;
  button: DeckButton;
  isNotEmpty: boolean;
  onClick?: (id?: string) => void;
};

export function DeckCellButton(props: DeckCellButtonProps) {
  return (
    <div
      key={props.id}
      onClick={() => props.onClick?.(props.button.startActionId)}
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
      {props.isNotEmpty ? (
        <>{props.id}</>
      ) : (
        <>
          <PlusIcon />
        </>
      )}
    </div>
  );
}
