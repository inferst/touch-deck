import { DeckCell } from "@/components/Deck/DeckCell";
import { cn } from "@/lib/utils";
import { useSettingsQuery } from "@/queries/settings";

const cells = [...Array(64).keys()].map((cell) => cell + 1);

type ValidKeys = 2 | 3 | 4 | 5 | 6 | 7 | 8;

function toValidKey(num: number): ValidKeys {
  const validKeys: ValidKeys[] = [2, 3, 4, 5, 6, 7, 8];

  if (validKeys.includes(num as ValidKeys)) {
    return num as ValidKeys;
  }

  throw new Error("Rows or cols are not valid");
}

const gridCols: Record<ValidKeys, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
};

const gridRows: Record<ValidKeys, string> = {
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
  7: "grid-rows-7",
  8: "grid-rows-8",
};

export function DeckGrid() {
  const { data, isError, isPending } = useSettingsQuery();

  if (isPending) {
    return "Loading...";
  }

  if (isError) {
    return "Error...";
  }

  return (
    <div className="mx-8 relative h-dvh">
      <div
        className={cn(
          "grid",
          "gap-[2%]",
          "max-h-[calc(70dvh)]",
          "left-[50%]",
          "top-[50%]",
          "translate-x-[-50%]",
          "translate-y-[-50%]",
          "absolute",
          "w-full",
          "aspect-[var(--aspectRatio)]",
          gridCols[toValidKey(data.layout.columns)],
          gridRows[toValidKey(data.layout.rows)],
        )}
        style={
          {
            "--aspectRatio": `${data.layout.columns} / ${data.layout.rows}`,
          } as React.CSSProperties
        }
      >
        {cells
          .filter((_, key) => key < data.layout.columns * data.layout.rows)
          .map((cell) => (
            <DeckCell key={cell} id={cell} />
          ))}
      </div>
    </div>
  );
}
