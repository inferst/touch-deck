import { useThrottle } from "@workspace/deck/utils/throttle";
import { cn } from "@workspace/ui/lib/utils";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DeckGridProps = {
  children: (id: number) => ReactNode;
  rows: number;
  columns: number;
  className?: string;
};

export function DeckGrid(props: DeckGridProps) {
  const { children, rows, columns, className } = props;

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
    throttledUpdateScreenRatio();

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
        {grid.map((row, index) => {
          return (
            <div
              key={index}
              className={cn(
                "flex h-[var(--height)] @container",
              )}
            >
              {row.map((id) => {
                return children(id);
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
