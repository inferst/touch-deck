import { DeckGridContext } from "@workspace/deck/components/DeckContext";
import { Spacing } from "@workspace/deck/types/board";
import { useThrottle } from "@workspace/deck/utils/throttle";
import { cn } from "@workspace/ui/lib/utils";
import {
  memo,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type DeckGridProps = {
  children: (row: number, col: number) => ReactNode;
  rows: number;
  columns: number;
  spacing?: Spacing;
  className?: string;
};

export const DeckGrid = memo((props: DeckGridProps) => {
  const { children, rows, columns, spacing = 0, className } = props;

  const [screenRatio, setScreenRatio] = useState(1);
  const [cellBorderWidth, setCellBorderWidth] = useState(0);
  const [cellSpacing, setCellSpacing] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

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

  const calculateScreenRatio = useCallback((entry: ResizeObserverEntry) => {
    const containerWidth = entry.contentRect.width;
    const containerHeight = entry.contentRect.height;
    setScreenRatio(containerWidth / containerHeight);
    console.log("screenRatio", containerWidth, containerHeight);
  }, []);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      const cellWidth = wrapper.clientWidth / columns;
      setCellBorderWidth(Math.round((cellWidth * 2) / 100));
      setCellSpacing(Math.round((spacing * (cellWidth * 2)) / 100));
    }
  }, [screenRatio, columns, rows, spacing]);

  const throttledCalculateScreenRatio = useThrottle(calculateScreenRatio, 0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    setScreenRatio(containerWidth / containerHeight);

    const reszeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        throttledCalculateScreenRatio(entry);
      }
    });

    reszeObserver.observe(container);

    return () => {
      reszeObserver.unobserve(container);
    };
  }, [throttledCalculateScreenRatio]);

  const contextValue = useMemo(
    () => ({ borderWidth: cellBorderWidth }),
    [cellBorderWidth],
  );

  console.log("DeckGrid render");

  return (
    <DeckGridContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn(className, "@container")}>
        <div
          ref={wrapperRef}
          className={cn(
            "flex",
            "flex-col",
            "aspect-(--aspect-ratio)",
            screenRatio < columns / rows ? "w-full" : "h-full",
          )}
          style={
            {
              "--aspect-ratio": `${columns} / ${rows}`,
              "--width": `${100 / columns}%`,
              "--height": `${100 / rows}%`,
              "--spacing": `${cellSpacing}px`,
            } as React.CSSProperties
          }
        >
          {grid.map((row, rowIndex) => {
            return (
              <div
                key={rowIndex}
                className={cn("flex h-(--height) @container")}
              >
                {row.map((colIndex) => {
                  return (
                    <div
                      key={colIndex}
                      className={cn("w-(--width) m-(--spacing)")}
                    >
                      {children(rowIndex, colIndex)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </DeckGridContext.Provider>
  );
});
