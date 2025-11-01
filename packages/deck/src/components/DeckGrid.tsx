import { useThrottle } from "@workspace/deck/utils/throttle";
import { cn } from "@workspace/ui/lib/utils";
import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DeckGridProps = {
  children: (row: number, col: number) => ReactNode;
  rows: number;
  columns: number;
  className?: string;
};

export const DeckGrid = memo((props: DeckGridProps) => {
  const { children, rows, columns, className } = props;

  const [screenRatio, setScreenRatio] = useState(1);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const grid = useMemo(() => {
    const result = [];

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      const row = [];

      for (let column = 0; column < columns; column++) {
        row.push(column);
      }

      result.push(row);
    }

    return result;
  }, [rows, columns]);

  const updateScreenRatio = useCallback(() => {
    const container = containerRef.current;

    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;

      setScreenRatio(width / height);
    }
  }, []);

  const throttledUpdateScreenRatio = useThrottle(updateScreenRatio, 500);

  useEffect(() => {
    updateScreenRatio();

    window.addEventListener("resize", throttledUpdateScreenRatio);

    return () => {
      window.removeEventListener("resize", throttledUpdateScreenRatio);
    };
  }, [rows, columns, updateScreenRatio]);

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
            "--height": `${100 / rows}%`,
          } as React.CSSProperties
        }
      >
        {grid.map((row, rowIndex) => {
          return (
            <div
              key={rowIndex}
              className={cn("flex h-[var(--height)] @container")}
            >
              {row.map((colIndex) => {
                return children(rowIndex, colIndex);
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});
