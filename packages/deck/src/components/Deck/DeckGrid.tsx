import { DeckCell } from "@workspace/deck/components/Deck/DeckCell";
import { DeckButton, DeckButtons, DeckMode } from "@workspace/deck/types/deck";
import { ComboboxItem } from "@workspace/ui/components/Combobox";
import { cn } from "@workspace/ui/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DeckGridProps = {
  rows: number;
  columns: number;
  buttons: DeckButtons;
  actions?: ComboboxItem[];
  className?: string;
  mode: DeckMode;
  onActionStart?: (id: string) => void;
  onActionEnd?: (id: string) => void;
  onSave?: (buttons: DeckButtons) => void;
};

export function DeckGrid(props: DeckGridProps) {
  const {
    rows,
    columns,
    buttons,
    actions,
    mode,
    onActionStart,
    onActionEnd,
    onSave,
    className,
  } = props;

  const [screenRatio, setScreenRatio] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const grid = useMemo(() => {
    const result = [];

    for (let row = 0; row < rows; row++) {
      const rowArray = [];

      for (let column = 0; column < columns; column++) {
        rowArray.push(row * columns + column);
      }

      result.push(rowArray);
    }

    return result;
  }, [rows, columns]);

  const handleSave = (button: DeckButton) => {
    onSave?.({ ...buttons, [button.id]: button });
  };

  const handleResize = useCallback(() => {
    const container = containerRef.current;

    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;

      setScreenRatio(width / height);
    }
  }, []);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [rows, columns, handleResize]);

  return (
    <div ref={containerRef} className={className}>
      <div
        className={cn(
          "flex",
          "flex-col",
          "aspect-[var(--aspectRatio)]",
          screenRatio < columns / rows ? "w-full" : "h-full",
        )}
        style={
          {
            "--aspectRatio": `${columns} / ${rows}`,
          } as React.CSSProperties
        }
      >
        {grid.map((row, index) => {
          return (
            <div key={index} className="flex grow">
              {row.map((id) => {
                return (
                  <DeckCell
                    width={100 / columns}
                    key={id}
                    id={id}
                    button={buttons[id]}
                    mode={mode}
                    actions={actions}
                    onActionStart={onActionStart}
                    onActionEnd={onActionEnd}
                    onSave={handleSave}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
