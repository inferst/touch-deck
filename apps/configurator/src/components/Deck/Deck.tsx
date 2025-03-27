import { useSettingsQuery } from "@/queries/settings";
import { DeckGrid } from "@workspace/deck/components/Deck/DeckGrid";

export function Deck() {
  const { data, isError, isPending } = useSettingsQuery();

  if (isPending) {
    return "Loading...";
  }

  if (isError) {
    return "Error...";
  }

  return (
    <DeckGrid
      rows={data.layout.rows}
      columns={data.layout.columns}
      className="w-full h-full flex justify-center items-center"
    />
  );
}
